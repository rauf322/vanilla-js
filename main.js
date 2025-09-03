const listItems = document.querySelector("ul");
const inputBlock = document.querySelector("form");
const [enterItem, filterItem] = document.querySelectorAll("input");
const btnClearAll = document.querySelectorAll("button")[1];

init();
function init() {
  fetchDataStorage();
  inputBlock.addEventListener("submit", onAddItemSubmit);
  btnClearAll.addEventListener("click", () => {
    listItems.innerText = "";
    localStorage.setItem("items", JSON.stringify([]));
    hideHandler();
  });
  filterItem.addEventListener("input", onFilterItems);
  chuck();
}

async function chuck() {
  const data = await fetch("https://api.chucknorris.io/jokes/random");
  const res = await data.json();
  const joke = res.value;
  const h1 = document.createElement("h1");
  h1.innerText = joke != undefined ? joke : "Not funny api broke";
  const body = document.querySelector("body");
  body.appendChild(h1);
}

function hideHandler() {
  if (listItems.children.length > 0) {
    filterItem.value = "";
    filterItem.style.display = "block";
    btnClearAll.style.display = "block";
  } else {
    filterItem.style.display = "none";
    btnClearAll.style.display = "none";
  }
}

function onFilterItems(e) {
  const filterText = e.target.value.toLowerCase();
  const allListItems = document.querySelectorAll(".item-content");

  if (filterText === "") {
    allListItems.forEach((item) => (item.parentNode.style.display = "flex"));
    return;
  }
  allListItems.forEach((item) => {
    const itemText = item.textContent.toLowerCase();
    item.parentNode.style.display = itemText.includes(filterText)
      ? "flex"
      : "none";
    if (itemText == filterText) {
      item.parentNode.style.background = "blue";
    } else {
      item.parentNode.style.background = "rgba(255, 255, 255, 0.05)";
    }
  });
}

function onAddItemSubmit(e) {
  e.preventDefault();
  if (e.key == undefined || e.key == "Enter") {
    if (enterItem.value.length > 0) {
      addToStorage(enterItem.value);
      addItemToDom(enterItem.value);
    }
  }
}
function addItemToDom(item) {
  let li = document.createElement("li");
  let itemContent = document.createElement("div");
  let label = document.createElement("label");
  let input = document.createElement("input");
  let a = document.createElement("a");

  itemContent.className = "item-content";
  a.textContent = "delete";
  input.type = "checkbox";
  input.id = `item-${Date.now()}`;
  label.htmlFor = input.id;
  label.appendChild(document.createTextNode(item));

  itemContent.appendChild(input);
  itemContent.appendChild(label);
  li.appendChild(itemContent);
  li.appendChild(a);
  listItems.appendChild(li);
  enterItem.value = "";

  a.addEventListener("click", (e) => {
    removeFromStorage(li.querySelector("label").textContent);
    li.remove();
    hideHandler();
  });
  hideHandler();
}

function removeFromStorage(item) {
  let fetchData = JSON.parse(localStorage.getItem("items"));
  fetchData = fetchData.filter((obj) => obj != item);
  localStorage.setItem("items", JSON.stringify(fetchData));
}

function fetchDataStorage() {
  if (localStorage.getItem("items") == null) {
    localStorage.setItem("items", JSON.stringify([]));
    return;
  }
  const fetchData = JSON.parse(localStorage.getItem("items"));
  fetchData.map((item) => addItemToDom(item));
}

function addToStorage(item) {
  const fetchData = JSON.parse(localStorage.getItem("items"));
  fetchData.push(item);
  localStorage.setItem("items", JSON.stringify(fetchData));
}
