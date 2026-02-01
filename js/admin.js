// DOM elementleri
const manageRoomsBtn = document.getElementById("manageRoomsBtn");
const roomsBtn = document.getElementById("roomsBtn");
const reservationsBtn = document.getElementById("reservationsBtn");
const panelContent = document.getElementById("panelContent");

// --- Oda ekle/sil ---
manageRoomsBtn.addEventListener("click", async () => {
  panelContent.innerHTML = `
    <h2>Oda Ekle/Sil</h2>
    <form id="addRoomForm">
      <input type="text" id="roomNumber" placeholder="Oda Numarası" required>
      <input type="text" id="roomName" placeholder="Oda İsmi" required>
      <button type="submit">Oda Ekle</button>
    </form>
    <div id="roomList">Yükleniyor...</div>
  `;

  const roomList = document.getElementById("roomList");
  
  async function loadRooms() {
    // Backendten odaları çek
    const res = await fetch("/api/rooms");
    const rooms = await res.json();
    roomList.innerHTML = "";
    rooms.forEach(room => {
      const div = document.createElement("div");
      div.textContent = `${room.room_number} - ${room.room_name}`;
      div.style.cursor = "pointer";
      div.addEventListener("click", async () => {
        if(confirm("Odayı silmek istiyor musunuz?")) {
          await fetch(`/api/rooms/${room.id}`, { method: "DELETE" });
          loadRooms();
        }
      });
      roomList.appendChild(div);
    });
  }

  loadRooms();

  document.getElementById("addRoomForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const roomNumber = document.getElementById("roomNumber").value;
    const roomName = document.getElementById("roomName").value;
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_number: roomNumber, room_name: roomName })
    });
    loadRooms();
  });
});

// --- Odalar ---
roomsBtn.addEventListener("click", async () => {
  panelContent.innerHTML = "<h2>Odalar</h2><div id='roomCards'></div>";
  const roomCards = document.getElementById("roomCards");

  async function loadRooms() {
    const res = await fetch("/api/rooms");
    const rooms = await res.json();
    roomCards.innerHTML = "";
    rooms.forEach(room => {
      const div = document.createElement("div");
      div.classList.add("room-card", `status-${room.status}`);
      div.innerHTML = `<div>${room.room_number}<br>${room.room_name}</div>`;
      div.addEventListener("click", () => {
        showRoomActions(room);
      });
      roomCards.appendChild(div);
    });
  }

  loadRooms();

  async function showRoomActions(room) {
    let action = prompt(`Oda ${room.room_number} - ${room.room_name}\nSeçenekler:\n1: Check-in\n2: Check-out\n3: Temizle\nSeçiminizi yazın (1/2/3)`);
    
    if(action === "1") {
      const customerName = prompt("Müşteri adı:");
      const checkIn = new Date().toISOString().split("T")[0];
      await fetch(`/api/rooms/${room.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_name: customerName, check_in: checkIn })
      });
    } else if(action === "2") {
      const payment = prompt("Ödeme alındı mı? (evet/hayır)");
      if(payment.toLowerCase() === "evet") {
        await fetch(`/api/rooms/${room.id}/checkout`, { method: "POST" });
      }
    } else if(action === "3") {
      await fetch(`/api/rooms/${room.id}/clean`, { method: "POST" });
    }

    loadRooms();
  }
});

// --- Rezervasyonlar ---
reservationsBtn.addEventListener("click", () => {
  panelContent.innerHTML = "<h2>Rezervasyonlar</h2><p>Henüz yapılmadı.</p>";
});
