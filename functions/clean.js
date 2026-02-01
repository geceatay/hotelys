export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // /api/rooms/:id/clean
  const roomId = pathParts[pathParts.length - 2];

  // Oda durumunu müsait yap
  await env.otelvt
    .prepare("UPDATE rooms SET status='available' WHERE id=?")
    .bind(roomId)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
