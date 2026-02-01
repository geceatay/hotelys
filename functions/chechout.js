
export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // /api/rooms/:id/checkout
  const roomId = pathParts[pathParts.length - 2];

  // Oda durumunu temizlik gerekiyor olarak güncelle
  await env.otelvt
    .prepare("UPDATE rooms SET status='cleaning' WHERE id=?")
    .bind(roomId)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
