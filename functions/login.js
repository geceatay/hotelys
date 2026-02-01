export const onRequestPost = async ({ request, env }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Eksik bilgi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await env.otelvt
      .prepare(
        "SELECT id, username, role FROM users WHERE username = ? AND password = ?"
      )
      .bind(username, password)
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Kullanıcı adı veya şifre yanlış"
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Sunucu hatası",
        error: e.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
