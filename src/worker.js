export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1️⃣ ROOT → login.html 
    if (request.method === "GET" && url.pathname === "/") {
      return Response.redirect(`${url.origin}/login.html`, 302);
    }

    // 2️⃣ LOGIN API (POST)
    if (url.pathname === "/api/login" && request.method === "POST") {
      const { username, password } = await request.json();

      if (!username || !password) {
        return json({ error: "Eksik bilgi" }, 400);
      }

      const user = await env.DB.prepare(
        "SELECT id, role FROM users WHERE username = ? AND password = ?"
      ).bind(username, password).first();

      if (!user) {
        return json({ error: "Kullanıcı bulunamadı" }, 401);
      }

      return json({
        success: true,
        role: user.role
      });
    }

    // 3️⃣ DİĞER TÜM GET → static dosyalar
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // 4️⃣ DİĞER HER ŞEY
    return new Response("Method Not Allowed", { status: 405 });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
