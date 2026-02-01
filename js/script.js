const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.success) {
    message.textContent = `Hoşgeldiniz, ${data.user.username}!`;
    message.style.color = "green";
    // role kontrolü ile admin / reception paneline yönlendirme yapılabilir
  } else {
    message.textContent = "Kullanıcı adı veya şifre yanlış!";
    message.style.color = "red";
  }
});
