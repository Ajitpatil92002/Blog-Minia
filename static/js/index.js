const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  nav.classList.toggle("flex");
  nav.classList.toggle("hidden");
});

const popupOverlay = document.querySelector(".popup-overlay");
const popupClose = document.querySelector(".popup-close");

popupClose.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});

setTimeout(() => {
  popupOverlay.style.display = "block";
}, 2000);
