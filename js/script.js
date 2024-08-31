"use strict";
/***********ELEMENTS***********/
let user = document.querySelector("nav .btns input:nth-child(1)");
let pin = document.querySelector("nav .btns input:nth-child(2)");
let app = document.querySelector("main");
let enter = document.querySelector("nav .btns button");
let header = document.querySelector("nav>p");
let date = document.querySelector("header>p span");
let balance = document.querySelector("header p.balance ");
let loginDate = document.querySelector("header p span");

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
let sortState = 0; //0==>notSorted     1==>sorted
let sessionTimer = {
  sec: 0,
  min: 0,
};
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-25T07:42:02.383Z",
    "2024-08-26T23:36:17.929Z",
    "2024-08-27T10:51:36.790Z",
    "2024-08-28T09:15:04.904Z",
    "2024-08-29T10:17:24.185Z",
    "2024-08-30T14:11:59.604Z",
    "2024-08-31T17:01:17.194Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
accounts.forEach((obj) => {
  obj.userName = obj.owner
    .split(" ")
    .map((i) => i[0].toLocaleLowerCase())
    .join("");
});

/***********UTILITIES***********/
function displayTime() {
  let timer = new Date();
  timer.setMinutes(sessionTimer.min);
  timer.setSeconds(sessionTimer.sec);

  time.textContent = new Intl.DateTimeFormat(navigator.language, {
    minute: "numeric",
    second: "numeric",
  }).format(timer);
}
function resetTimer() {
  sessionTimer.min = 10;
  sessionTimer.sec = 0;
}
function currencyFormatter(locale, curr, value) {
  return new Intl.NumberFormat(locale, {
    currency: curr,
    style: "currency",
  }).format(value);
}

function displaymovements(customer) {
  let { movements: mov } = accounts[customer];
  let mv = [...mov];
  if (sortState) {
    mv.sort((a, b) => a - b);
  }
  mv.forEach(function (val, index) {
    let state = val > 0; //1==>deposit 0==>withdrawal
    let indate = new Date(activeAccount.movementsDates[index]);

    /*******************************************************/
    /************GENERATING MOVEMENT DATE************/
    let date = Intl.DateTimeFormat(activeAccount.locale).format(indate);

    let passedDays = Math.round(
      Math.abs((new Date() - indate) / (1000 * 60 * 60 * 24))
    );
    if (passedDays <= 7) {
      switch (passedDays) {
        case 0:
          date = "Today";
          break;
        case 1:
          date = `Yesterday`;
          break;
        default:
          date = `${passedDays} days ago`;
          break;
      }
    }
    /*******************************************************/
    let transHTML = ` <div class="element">
                    <div class="lables">

                        <p class="label ${state ? "green" : "red"}">${
      index + 1
    } ${state ? "DEPOSIT" : "WITHDRAWAL"}</p>
                        <span class="date">
                            ${date}
                        </span>
                    </div>
                    <span class="balance">
                        ${currencyFormatter(
                          activeAccount.locale,
                          activeAccount.currency,
                          val
                        )}
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
function updateInterface(index = -1) {
  let msg = header;
  if (index === -1) {
    msg.textContent = `Log in to get started`;
  } else {
    let fn = accounts[index].owner;
    transactions.innerHTML = "";
    displaymovements(index);
    msg.textContent = `Good Day, ${fn.slice(0, fn.indexOf(" ") + 1)}!`;
    /***********************************************************/
    /**HEADER INFO**/
    balance.textContent = balance.textContent = currencyFormatter(
      activeAccount.locale,
      activeAccount.currency,
      totalBalance(index)
    );

    loginDate.textContent = Intl.DateTimeFormat(activeAccount.locale, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date());
    /***********************************************************/

    let summary = calcSummary(index);
    In.textContent = currencyFormatter(
      activeAccount.locale,
      activeAccount.currency,
      summary[0]
    );
    out.textContent = currencyFormatter(
      activeAccount.locale,
      activeAccount.currency,
      summary[1]
    );
    interest.textContent = currencyFormatter(
      activeAccount.locale,
      activeAccount.currency,
      summary[2]
    );
    user.value = "";
    pin.value = "";
    user.blur();
    pin.blur();
  }
}
function login() {
  let userName = user.value;
  let pinVal = +pin.value;
  resetTimer();
  displayTime();
  activeAccount =
    accounts.find(
      (i) => i.userName === userName && i.pin === pinVal && (resetTimer() || 1)
    ) || activeAccount;
  if (activeAccount) {
    app.style.opacity = 1;
    sortState = 0;
    updateInterface(accounts.indexOf(activeAccount));
  }
}

function transferFromto(a, b, amount) {
  if (totalBalance(accounts.indexOf(a)) < amount || a === b) {
    alert("Invalid transfer !!!");
    return;
  }
  resetTimer();
  a.movements.push(-1 * amount);
  a.movementsDates.push(new Date().toISOString());
  b.movements.push(1 * amount);
  b.movementsDates.push(new Date().toISOString());
  updateInterface(accounts.indexOf(a));
}
function transfer() {
  let to = transTo.value;
  let amount = Math.round(transAmount.value);
  let from = activeAccount;
  let toObj = accounts.find((i) => i.userName === to);
  setTimeout(function () {
    from && toObj && transferFromto(from, toObj, amount);
  }, 2000);
  transTo.value = "";
  transAmount.value = "";
  transAmount.blur();
  transTo.blur();
}
function checkLoan(amount) {
  if (activeAccount.movements.some((i) => 0.1 * amount <= i)) {
    resetTimer();
    activeAccount.movements.push(amount);
    activeAccount.movementsDates.push(new Date().toISOString());
    alert("Successful loan");
    updateInterface(accounts.indexOf(activeAccount));
  } else alert("Invalid loan");
}
function requestLoan() {
  let amount = Math.round(loanAmount.value);
  setTimeout(checkLoan, 2000, amount);
  loanAmount.value = "";
  loanAmount.blur();
}

function logOut() {
  app.style.opacity = "0";
  activeAccount = "";
  updateInterface();
}
function closeAcc() {
  let user = closeUser.value;
  let pin = closePin.value;
  let index = accounts.findIndex((i) => i.userName === user && i.pin === +pin);
  let acc = undefined;
  if (index >= 0) acc = accounts[index];
  index >= 0 &&
    accounts.splice(index, 1) &&
    (alert("Closed Successfully") || 1) &&
    acc === activeAccount &&
    logOut();
  closeUser.value = "";
  closePin.value = "";
  closeUser.blur();
  closePin.blur();
}
setInterval(
  function (c) {
    displayTime();
    if (c.sec === 0 && c.min === 0) {
      logOut();
    }
    if (c.sec == 0 && c.min > 0) {
      c.min--;
      c.sec = 60;
    }
    c.sec--;
  },
  1000,
  sessionTimer
);
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
loanBtn.addEventListener("click", requestLoan);
loanAmount.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    requestLoan();
  }
});
sort.addEventListener("click", function () {
  sortState = !sortState;
  updateInterface(accounts.indexOf(activeAccount));
});