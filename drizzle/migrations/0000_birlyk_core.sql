CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  organization text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, organization)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.raw_user_meta_data->>'organization')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  event_date date,
  event_time text,
  venue_name text,
  venue_address text,
  layout jsonb NOT NULL DEFAULT '{"width":1000,"height":700,"tables":[],"features":[]}'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner select events" ON public.events FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner update events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner delete events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  owner_id uuid,
  full_name text NOT NULL,
  phone text,
  table_label text,
  seat_number int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner select guests" ON public.guests FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner insert guests" ON public.guests FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.owner_id = auth.uid()));
CREATE POLICY "owner update guests" ON public.guests FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner delete guests" ON public.guests FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE INDEX guests_event_idx ON public.guests(event_id);

-- Public lookup: only published events, never returns phone numbers
CREATE OR REPLACE FUNCTION public.find_guest(_q text, _slug text DEFAULT NULL)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(jsonb_agg(r), '[]'::jsonb) FROM (
    SELECT g.id, g.full_name, g.table_label, g.seat_number,
      jsonb_build_object('title', e.title, 'slug', e.slug, 'event_date', e.event_date, 'event_time', e.event_time,
        'venue_name', e.venue_name, 'venue_address', e.venue_address, 'layout', e.layout) AS event
    FROM public.guests g JOIN public.events e ON e.id = g.event_id
    WHERE e.is_published
      AND length(trim(_q)) >= 2
      AND (_slug IS NULL OR e.slug = _slug)
      AND (g.full_name ILIKE '%' || trim(_q) || '%'
           OR (length(regexp_replace(_q, '\D', '', 'g')) >= 6 AND regexp_replace(coalesce(g.phone,''), '\D', '', 'g') LIKE '%' || regexp_replace(_q, '\D', '', 'g') || '%'))
    ORDER BY g.full_name LIMIT 10
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_public_event(_slug text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('title', title, 'slug', slug, 'event_date', event_date, 'event_time', event_time,
    'venue_name', venue_name, 'venue_address', venue_address, 'layout', layout)
  FROM public.events WHERE slug = _slug AND is_published;
$$;
GRANT EXECUTE ON FUNCTION public.find_guest(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_event(text) TO anon, authenticated;

-- Demo published event
INSERT INTO public.events (id, owner_id, title, slug, event_date, event_time, venue_name, venue_address, layout, is_published) VALUES
('00000000-0000-0000-0000-0000000000d1', NULL, 'Aruzhan & Daniyar Wedding Toi', 'demo-toi', '2026-11-14', '18:00', 'Altyn Orda Hall', 'Al-Farabi Ave 77, Almaty',
'{"width":1000,"height":700,"features":[{"type":"stage","label":"Stage","x":350,"y":30,"w":300,"h":80},{"type":"dancefloor","label":"Dance floor","x":380,"y":140,"w":240,"h":150},{"type":"door","label":"Entrance","x":440,"y":660,"w":120,"h":30},{"type":"bar","label":"Bar","x":860,"y":420,"w":110,"h":200}],
"tables":[{"id":"t1","label":"1","shape":"round","x":150,"y":180,"w":120,"h":120,"seats":8},{"id":"t2","label":"2","shape":"round","x":150,"y":400,"w":120,"h":120,"seats":8},{"id":"t3","label":"3","shape":"round","x":330,"y":420,"w":120,"h":120,"seats":8},{"id":"t4","label":"4","shape":"round","x":550,"y":420,"w":120,"h":120,"seats":8},{"id":"t5","label":"5","shape":"round","x":730,"y":180,"w":120,"h":120,"seats":8},{"id":"t6","label":"6","shape":"rect","x":680,"y":400,"w":140,"h":80,"seats":6},{"id":"t7","label":"VIP","shape":"rect","x":60,"y":40,"w":220,"h":70,"seats":8}]}', true);

INSERT INTO public.guests (event_id, full_name, phone, table_label, seat_number) VALUES
('00000000-0000-0000-0000-0000000000d1','Aruzhan Bekova','+7 701 555 1234','3',4),
('00000000-0000-0000-0000-0000000000d1','Daniyar Seitkali','+7 702 555 9876','VIP',2),
('00000000-0000-0000-0000-0000000000d1','Aigerim Nurlanova','+7 705 555 4321','1',6),
('00000000-0000-0000-0000-0000000000d1','Timur Akhmetov','+7 707 555 1111','5',1),
('00000000-0000-0000-0000-0000000000d1','Leyla Mammadova','+994 50 555 2222','6',3);