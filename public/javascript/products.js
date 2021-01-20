const productImages = document.querySelectorAll("img");
const productDisplayArea = document.querySelector(".product-display-area");
const productSection = document.querySelector(".product-section");

window.addEventListener("load", function () {
  productSection.classList.remove("spinner");
  productDisplayArea.classList.remove("hidden");
});
