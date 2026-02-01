export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // JSON body al
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Eksik bilgi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // D1 sorgusu
    const user = await env.otelvt
      .prepare(
        "SELECT id, username, role FROM users WHERE username = ? AND password = ?"
      )
      .bind(username, password)
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Kullanıcı adı veya şifre yanlış" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Başarılı login
    return new Response(
      JSON.s
