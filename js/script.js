"use strict";
/***********ELEMENTS***********/
let user = document.querySelector("nav .btns input:nth-child(1)");
let pin = document.querySelector("nav .btns input:nth-child(2)");
let app = document.querySelector("main");
let enter = document.querySelector("nav .btns button");
let header = document.querySelector("nav>p");
let date = document.querySelector("header>p span");
let balance = document.querySelector("header p.balance ");

let transactions = document.querySelector(".trans");

/**TRANSFER MONEY**/
let transTo = document.querySelector(".transfer input:first-child");
let transAmount = document.querySelector(".transfer input:nth-child(2)");
let transBtn = document.querySelector(".transfer button");
/**LOANS**/
let loanAmount = document.querySelector(".loan input");
let loanBtn = document.querySelector(".loan button");
/**CLOSE ACCOUNT**/
let closeUser = document.querySelector(".close input:first-child");
let closePin = document.querySelector(".close input:nth-child(2)");
let closeBtn = document.querySelector(".close button");
/**FOOTER**/
let In = document.querySelector("footer ul .green-fnt:nth-child(1)");
let out = document.querySelector("footer ul .red-fnt");
let interest = document.querySelectorAll("footer ul .green-fnt")[1];
let sort = document.querySelector("footer ul button");
let time = document.querySelector("footer .now");
/***********HARD CODED DATA***********/
let activeAccount;
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
accounts.forEach((obj) => {
  obj.userName = obj.owner
    .split(" ")
    .map((i) => i[0].toLocaleLowerCase())
    .join("");
});
let users = accounts.map(function (val) {
  return {
    user: val.owner
      .split(" ")
      .map((i) => i[0].toLocaleLowerCase())
      .join(""),
    pin: val["pin"],
    fullName: val.owner,
  };
});
/***********UTILITIES***********/
function displaymovements(customer) {
  let { movements: mv } = accounts[customer];
  mv.forEach(function (val, index) {
    let state = val > 0; //1==>deposit 0==>withdrawal
    let transHTML = ` <div class="element">
                    <div class="lables">

                        <p class="label ${state ? "green" : "red"}">${
      index + 1
    } ${state ? "DEPOSIT" : "WITHDRAWAL"}</p>
                        <span class="date">
                            12/03/2020
                        </span>
                    </div>
                    <span class="balance">
                        ${val} €
                    </span>
                </div>`;
    transactions.insertAdjacentHTML("afterbegin", transHTML);
  });
}
function totalBalance(index) {
  return accounts[index].movements.reduce((acc, val) => acc + val, 0);
}
function calcSummary(index) {
  let movs = accounts[index].movements;
  let interest = accounts[index].interestRate;
  let IN = movs.filter((i) => i > 0).reduce((ac, i) => ac + i, 0);
  let OUT = -1 * movs.filter((i) => i < 0).reduce((ac, i) => ac + i, 0);
  let int = (IN * interest) / 100;
  return [IN, OUT, int];
}
function updateInterface(index) {
  let msg = header;
  let fn = accounts[index].owner;
  transactions.innerHTML = "";
  displaymovements(index);
  msg.textContent = `Good Day, ${fn.slice(0, fn.indexOf(" ") + 1)}!`;
  balance.textContent = `${totalBalance(index)} €`;
  let summary = calcSummary(index);
  In.textContent = `${summary[0]} €`;
  out.textContent = `${summary[1]} €`;
  interest.textContent = `${summary[2]} €`;
  user.value = "";
  pin.value = "";
  user.blur();
  pin.blur();
}
function login() {
  let userName = user.value;
  let pinVal = +pin.value;

  activeAccount = accounts.find(
    (i) => i.userName === userName && i.pin === pinVal
  );
  if (activeAccount) {
    app.style.opacity = 1;
    updateInterface(accounts.indexOf(activeAccount));
  }
}

function transferFromto(a, b, amount) {
  if (totalBalance(accounts.indexOf(a)) < amount || a === b) {
    alert("Invalid transfer !!!");
    return;
  }
  a.movements.push(-1 * amount);
  b.movements.push(1 * amount);
  updateInterface(accounts.indexOf(a));
}
function transfer() {
  let to = transTo.value;
  let amount = transAmount.value;
  let from = activeAccount;
  let toObj = accounts.find((i) => i.userName === to);
  from && toObj && transferFromto(from, toObj, amount);
  transTo.value = "";
  transAmount.value = "";
  transAmount.blur();
  transTo.blur();
}
function logOut() {
  app.style.opacity = "0";
  activeAccount = "";
}
function closeAcc() {
  let user = closeUser.value;
  let pin = closePin.value;
  let index = accounts.findIndex((i) => i.userName === user && i.pin === +pin);
  let acc = undefined;
  if (index >= 0) acc = accounts[index];
  index >= 0 && accounts.splice(index, 1) && acc === activeAccount && logOut();
  closeUser.value = "";
  closePin.value = "";
  closeUser.blur();
  closePin.blur();
}

/***********EVENTS***********/
enter.addEventListener("click", login);
user.addEventListener("keydown", function (e) {
  e.key === "Enter" && login();
});
pin.addEventListener("keydown", function (e) {
  e.key === "Enter" && login();
});
transBtn.addEventListener("click", transfer);
transTo.addEventListener("keydown", function (e) {
  if (e.key === "Enter") transfer();
});
transAmount.addEventListener("keydown", function (e) {
  if (e.key === "Enter") transfer();
});
closeBtn.addEventListener("click", closeAcc);
closeUser.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    closeAcc();
  }
});
closePin.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    closeAcc();
  }
});
