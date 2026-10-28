//#region node_modules/.nitro/vite/services/ssr/assets/backend-api-t_CPCZq8.js
var backendUrl = "http://localhost:8080";
async function postJson(path, body) {
	const response = await fetch(`${backendUrl}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	if (!response.ok) throw new Error(`Backend request failed with status ${response.status}`);
}
function saveEventToPostgres(event) {
	return postJson("/api/events", event);
}
function saveGuestToPostgres(guest) {
	return postJson("/api/guests", guest);
}
//#endregion
export { saveGuestToPostgres as n, saveEventToPostgres as t };
