export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/login" && request.method === "POST") {
      const data = await request.json();
      const { username, password } = data;

      // D1 sorgusu
      const res = await env.otelvt.prepare(
        "SELECT * FROM users WHERE username = ? AND password = ?"
      )
      .bind(username, password)
      .all();

      if (res.results.length > 0) {
        return new Response(JSON.stringify({ success: true, user: res.results[0] }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Default cevap
    return new Response("OK");
  },
};
