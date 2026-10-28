const backendUrl = "http://localhost:8080";

async function postJson(path: string, body: unknown): Promise<void> {
  const response = await fetch(`${backendUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}`);
  }
}

export function saveEventToPostgres(event: {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
}): Promise<void> {
  return postJson("/api/events", event);
}

export function saveGuestToPostgres(guest: {
  id: string;
  eventId: string;
  ownerId: string;
  fullName: string;
  phone: string | null;
  tableLabel: string | null;
  seatNumber: number | null;
}): Promise<void> {
  return postJson("/api/guests", guest);
}
