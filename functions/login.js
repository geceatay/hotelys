export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Kullanıcı adı ve şifre zorunlu"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
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
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
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
      {
