<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Public guest lookup goes only through security-definer RPCs (`find_guest`, `get_public_event`) that filter to published events and never return phone numbers — keeps guest data private.
- Venue layouts are stored as JSON on the event (1000x700 coordinate space); guests link to tables by table label + seat number — one simple shape shared by the AI, editor and public map.
- UI text lives in `src/lib/i18n.tsx` dictionaries; every language must have every key — keeps all four languages complete.
