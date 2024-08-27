"use strict";
/***********ELEMENTS***********/
let user = document.querySelector("nav .btns input:nth-child(1)");
let pin = document.querySelector("nav .btns input:nth-child(2)");
let enter = document.querySelector("nav .btns button");
let header = document.querySelector("nav>p");
let date = document.querySelector("header>p span");
let balance = document.querySelector("header p.balance ");

let transactions = document.querySelector(".trans");

/**TRANSFET MONEY**/
let transTo = document.querySelector(".transfer input:first-child");
let transAmount = document.querySelector(".transfer input:nth-child(2)");
let transBtn = document.querySelector(".transfer button");
/**TRANSFET MONEY**/
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
