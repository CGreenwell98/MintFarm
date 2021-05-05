let basket;

// Fetch user's basket data:
fetch("/account/basket")
  .then((res) => res.json())
  .then((data) => {
    renderBasket(data);
    basket = data;
  })
  .then((_) => removeSpinner())
  .catch((err) => console.error(err));

// Delete Item from basket:
document.querySelector("#basket").addEventListener("click", function (event) {
  const clicked = event.target;
  // Guard clause:
  if (!clicked.classList.contains("delete-button")) return;
  const itemEl = event.target.closest(".account-basket-items");
  const itemName = itemEl.children[1].textContent;
  basket = basket.filter((item) => item.itemName !== itemName);

  fetch("/account/deleteItem", {
    method: "DELETE",
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
      method: "DELETE",
    }).then((_) => {
      deleteBasket();
      renderBasket(basket);
    });
  });

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions:
function displayItems(basketItems) {
  let totalCost = 0;
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
        <button type="button" class="btn delete-button">X</button>
    </div>
    `;
    document
      .querySelector(".account-basket-bottom")
      .insertAdjacentHTML("beforebegin", html);
    totalCost += Number(itemCost);
  });
  return totalCost.toFixed(2);
}

function toggleBasketUI(data) {
  if (data.length === 0) {
    document.querySelector(".account-basket-bottom").style.display = "none";
    document.querySelector(".account-basket-table").style.display = "none";
    document.querySelector(".basket-message").style.display = "flex";
  } else {
    document.querySelector(".account-basket-bottom").style.display = "flex";
    document.querySelector(".account-basket-table").style.display = "flex";
    document.querySelector(".basket-message").style.display = "none";
  }
}

function renderBasket(data) {
  const totalCost = displayItems(data);
  document.querySelector(".basket-total").textContent = `£${totalCost}`;
  toggleBasketUI(data);
}

function deleteBasket() {
  document
    .querySelectorAll(".account-basket-items")
    .forEach((el) => el.remove());
}

function removeSpinner() {
  document.querySelector(".spinner-box").classList.remove("invisible");
}
