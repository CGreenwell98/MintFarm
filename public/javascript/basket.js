let basket;

// Fetch user's basket data:
fetch("/account/basket")
  .then((res) => res.json())
  // .then((log) => console.log(log))
  .then((data) => {
    renderBasket(data);
    basket = data;
    console.log(basket);
  })
  .catch((err) => console.error(err));

// Delete Item from basket:
document.querySelector("#basket").addEventListener("click", function (event) {
  const clicked = event.target;
  // Guard clause:
  if (!clicked.classList.contains("delete-button")) return;
  const itemEl = event.target.closest(".account-basket-items");
  const itemName = itemEl.children[1].textContent;
  const itemForm = itemEl.children[5];
  basket = basket.filter((item) => item.itemName !== itemName);

  fetch("/account/deleteItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ itemName: itemName }),
  }).then((_) => {
    deleteBasket();
    renderBasket(basket);
  });
});

// Delete all items from basket:
document
  .querySelector(".delete-all-btn")
  .addEventListener("click", function () {
    basket = [];
    fetch("/account/deleteAll", {
      method: "POST",
    }).then((_) => {
      deleteBasket();
      renderBasket(basket);
    });
  });

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions:
function displayItems(basketItems) {
  let total = 0;
  let itemCost = 0;
  basketItems.forEach((item) => {
    // console.log(item);
    let html = `
    <div class="account-basket-items">
      <img
        class="basket-image"
        src=${item.source}
        alt=${item.itemName}.img
      />
      <p class="basket-name">${item.itemName}</p>
      <p class="basket-quantity">${item.quantity}</p>
      <p class="basket-price">£${item.price}</p>
      <p class="basket-price">
        £ ${(itemCost = (item.price * item.quantity).toFixed(2))}
      </p>
        <button type="submit" class="btn delete-button">X</button>
        <input
          type="hidden"
          name="basketItemName"
          value="${item.itemName}"
        />
    </div>
    `;
    document
      .querySelector(".account-basket-bottom")
      .insertAdjacentHTML("beforebegin", html);
    total = total + Number(itemCost);
  });
  return total.toFixed(2);
}

function hideBasketUI(total) {
  if (total == 0) {
    document.querySelector(".account-basket-bottom").classList.toggle("hidden");
    document.querySelector(".account-basket-table").classList.toggle("hidden");
    document.querySelector(".basket-message").classList.toggle("hidden");
  }
}

function renderBasket(data) {
  const total = displayItems(data);
  document.querySelector(".basket-total").textContent = `£${total}`;
  hideBasketUI(total);
}

function deleteBasket() {
  document
    .querySelectorAll(".account-basket-items")
    .forEach((el) => el.remove());
}
