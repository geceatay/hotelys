export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const method = request.method;

  if (method === "GET") {
    // Odaları getir
    const rooms = await env.otelvt
      .prepare("SELECT id, room_number, room_name, status FROM rooms")
      .all();
    return new Response(JSON.stringify(rooms.results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "POST") {
    // Yeni oda ekle
    const { room_number, room_name } = await request.json();
    await env.otelvt
      .prepare("INSERT INTO rooms (room_number, room_name, status) VALUES (?, ?, 'available')")
      .bind(room_number, room_name)
      .run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "DELETE") {
    // Oda sil
    const pathParts = url.pathname.split("/"); // /api/rooms/:id
    const id = pathParts[pathParts.length - 1]
