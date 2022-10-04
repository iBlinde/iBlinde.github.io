let u = 1;
let uMin = 1;
let uStep = uMin;
let uMax = 1000
let t = 0;
let c = 200;
let cMin = 5;
let cStep = cMin;
let cMax = 1000;
let total = 0;

doUpdatePage();

document.getElementById("cPHr").addEventListener("click", cPHr);
document.getElementById("uPHr").addEventListener("click", uPHr);
document.getElementById("mPHr").addEventListener("click", mPHr);

document.getElementById("c+").addEventListener("click", function() {
  doCharges('+');
});
document.getElementById("c-").addEventListener("click", function() {
  doCharges('-');
});
document.getElementById("u+").addEventListener("click", function() {
  doUnits('+');
});
document.getElementById("u-").addEventListener("click", function() {
  doUnits('-');
});
document.getElementById("h+").addEventListener("click", function() {
  doTime('h+');
});
document.getElementById("h-").addEventListener("click", function() {
  doTime('h-');
});
document.getElementById("m+").addEventListener("click", function() {
  doTime('m+');
});
document.getElementById("m-").addEventListener("click", function() {
  doTime('m-');
});


function cPHr() {
  alert("cPHr ping!");
}


function uPHr() {
  alert("uPHr ping!");
}


function mPHr() {
  alert("mPHr ping!");
}


function doCharges(selector) {
  let tmp = c;
  if (selector === '+') c += cStep;
  if (selector === '-') c -= cStep;
  if (c < cMin || c > cMax) c = tmp;

  doUpdatePage();
}


function doUnits(selector) {
  let tmp = u;
  if (selector === '+') u += uStep;
  if (selector === '-') u -= uStep;
  if (u < uMin || u > uMax) u = tmp;

  t = u * 6;

  doUpdatePage();
}


function doTime(selector) {
  let tmp = t;
  let tmpSelector = selector.slice(0, 1);
  let tmpOperator = selector.slice(1, 2);

  if (tmpSelector === 'h') {
    if (tmpOperator === '+') t += 60;
    if (tmpOperator === '-') t -= 60;
  }
  if (tmpSelector === 'm') {
    if (tmpOperator === '+') t += 6;
    if (tmpOperator === '-') t -= 6;
  }

  if (t < 6 || t > (uMax * 6)) t = tmp;

  u = t / 6;

  doUpdatePage();
}


function doUpdatePage() {
  t = u * 6;
  total = (c / 10) * u;

  document.getElementById("cPHr").textContent = c.toString();
  document.getElementById("uPHr").textContent = u.toString();
  document.getElementById("mPHr").textContent = timeString();
  document.getElementById("totalCharge").textContent = total.toString();
}

function timeString() {
  let h = 0;
  let tm = 0;
  let mStr = "";
  if (t >= 60) {
    h = Math.floor(t / 60);
    tm = t % 60;
  } else {
    tm = t;
  }

  if (tm < 10) {
    buff = "0" + tm.toString();
  } else {
    buff = tm.toString();
  }

  return h.toString() + ":" + buff;
}
