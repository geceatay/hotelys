export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // /api/rooms/:id/checkin
  const roomId = pathParts[pathParts.length - 2]; // id

  const { customer_name, check_in } = await request.json();

  // Oda durumu 'occupied' olarak güncelle
  await env.otelvt
    .prepare("UPDATE rooms SET status='occupied' WHERE id=?")
    .bind(roomId)
    .run();

  // Rezervasyon kaydı oluştur
  await env.otelvt
    .prepare("INSERT INTO reservations (room_id, customer_name, check_in, status) VALUES (?, ?, ?, 'active')")
    .bind(roomId, customer_name, check_in)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
