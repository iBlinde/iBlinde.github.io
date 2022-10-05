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
document.getElementById("mPMi").addEventListener("click", mPMi);

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
    let usrVal = prompt(`Enter value between ${cMin} and ${cMax} \nin steps of ${cStep}`, c);
    if (usrVal === null) { return; }

    let inp = parseInt(usrVal, 10);

    if (isNaN(inp)) {
        alert("Please enter a valid 'Charge per Hour'");
        return;
    }
    
    if (inp % 5 > 0) {
        alert(`Only charges divisible by ${cStep} allowed`);
        return;
    }

    if (inp < cMin || inp > cMax) {
        alert(`Values between ${cMin} and ${cMax} only`);
        return;
    }

    doCharges(inp);
}


function uPHr() {
    let usrVal = prompt(`Enter value between ${uMin} and ${uMax}`, u);
    if (usrVal === null) { return; }

    let inp = parseInt(usrVal, 10);

    if (isNaN(inp)) {
        alert("Please enter a valid 'Number of Units'");
        return;
    }

    if (inp < uMin || inp > uMax) {
        alert(`Values between ${uMin} and ${uMax} only`);
        return;
    }

    doUnits(inp);
}


function mPHr() {
    let usrVal = prompt(`Enter Number of Hours`, Math.floor(t / 60));
    if (usrVal === null) { return; }

    let inp = parseInt(usrVal, 10);

    if (isNaN(inp)) {
        alert("Please enter a valid 'Number of Hours'");
        return;
    }

    if (inp === 0) {
        if (t % 60 === 0) {
            alert("Hours cannot be 0 if Minutes are 00");
            return;
        }
    } else if (inp < 0 || inp > 100) {
        alert(`Values between 0 and 100 only`);
        return;
    }

    if ((inp * 60) + t > uMax * 6) {
        alert("Entered value would exceed time limit of 100 Hours");
        return;
    }

    doTime((inp * 60) + (t % 60));
}

function mPMi() {
    let usrVal = prompt(`Enter Number of Minutes in steps of 6`, t % 60);
    if (usrVal === null) { return; }

    let inp = parseInt(usrVal, 10);

    if (isNaN(inp)) {
        alert("Please enter a valid 'Number of Hours'");
        return;
    }

    if (inp === 0) {
        if (t < 60) {
            alert("Minutes cannot be 00 if Hours are 0");
            return;
        }
    } else if (inp < 0) {
        alert(`Values cannot be negative`);
        return;
    }

    if (inp % 6 > 0) {
        alert("'Number of Minutes' must be divisible by 6");
        return;
    }

    if (inp > uMax * 6) {
        alert("Minutes cannot be greater than 6000");
        return;
    }

    if (inp >= 60) {
        doTime(inp);
        return;
    }

    doTime(t - (t % 60) + inp);

}


function doCharges(selector) {
    let tmp = c;

    if (isNaN(selector)) {
        if (selector === '+') c += cStep;
        if (selector === '-') c -= cStep;
    } else {
        c = selector;
    }

  if (c < cMin || c > cMax) c = tmp;

  doUpdatePage();
}


function doUnits(selector) {
    let tmp = u;

    if (isNaN(selector)) {
        if (selector === '+') u += uStep;
        if (selector === '-') u -= uStep;
    } else {
        u = selector;
    }

    if (u < uMin || u > uMax) u = tmp;

    t = u * 6;

    doUpdatePage();
}


function doTime(selector) {
    let tmp = t;

    if (isNaN(selector)) {
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
    } else {
        t = selector;
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
    document.getElementById("mPHr").textContent = timeString(true);
    document.getElementById("mPMi").textContent = timeString(false);
  document.getElementById("totalCharge").textContent = total.toString();
  document.getElementById("totalCharge-sm").textContent = total.toString();
}

function timeString(sw) {
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

    if (sw) { return h.toString(); }

    return buff;
}
