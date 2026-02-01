document.getElementById("roomsBtn").addEventListener("click", () => {
  document.getElementById("panelContent").innerHTML = `
    <h2>Odalar</h2>
    <button>Yeni Oda Ekle</button>
    <div id="roomList">Yükleniyor...</div>
  `;
});

document.getElementById("reservationsBtn").addEventListener("click", () => {
  document.getElementById("panelContent").innerHTML = `
    <h2>Rezervasyonlar</h2>
    <div id="reservationList">Yükleniyor...</div>
  `;
});
