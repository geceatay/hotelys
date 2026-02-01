document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error");

  errorEl.textContent = "";

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      errorEl.textContent = data.message || "Giriş başarısız";
      return;
    }

    // ROLE GÖRE YÖNLENDİRME
    if (data.user.role === "admin") {
      window.location.href = "/admin.html";
    } else if (data.user.role === "reception") {
      window.location.href = "/reception.html";
    } else {
      errorEl.textContent = "Yetki tanımlı değil";
    }

  } catch (err) {
    errorEl.textContent = "Sunucu hatası";
    console.error(err);
  }
});
