let u = 1;
let uMin = 1;
let uStep = uMin;
let uMax = 1000;
let t = 0;
let c = 200;
let cMin = 5;
let cStep = cMin;
let cMax = 1000;
let total = 0;
let vat = 20;
let grandTotal_exVat = 0;
let grandTotal_incVat = 0;
let grandTotal_vat = 0;

const disModal = document.getElementById('disburseModal');
const modalDisbForm = document.querySelector('#disburseAddForm');
const modalVATCheckbox = modalDisbForm.querySelector('input[name="disbFTC"]');
const modalVATCheckbox_lbl = modalDisbForm.querySelector('#disbFormTaxChk_lbl');
const btn = modalDisbForm.querySelector('#addDisbursement');
modalVATCheckbox.addEventListener('change', function (e) {
    let tmpIh = 'VAT not included';
    if (this.checked) { tmpIh = 'incudes VAT'; }
    modalVATCheckbox_lbl.innerHTML = tmpIh;
});
btn.addEventListener('click', function (e) {
    e.preventDefault();
    addDisbursement();
});

const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);

let disbursements = new Array();
// disbursements[0] = new Array(3);

// disbursements = [[ 'ass', 50, true], ['biscuits', 100, false], ['chocolates', 240, true]];

doUpdatePage();

// disModal.addEventListener('show.bs.modal', addDisbursement);

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


function doCalculations() {
    let tCharge = roundAccurately((c / 10) * u, 2);
    let dCharge = 0;

    for (i = 0; i < disbursements.length; i++) {

        if (disbursements[i][2]) {
            dCharge += roundAccurately((disbursements[i][1] / (100 + vat)) * 100, 2);
        } else {
            dCharge += disbursements[i][1];
        }
    }

    grandTotal_exVat = tCharge + dCharge;
    grandTotal_vat = ((tCharge + dCharge) / 100) * vat;
    grandTotal_incVat = grandTotal_exVat + grandTotal_vat;

    return [tCharge, dCharge];
}


function doUpdatePage() {
    t = u * 6;

    const [timeTotal, dTot] = doCalculations();

    let timeVat = roundAccurately((timeTotal / 100) * vat, 2);
    let dVat = roundAccurately((dTot / 100) * vat, 2);


    document.getElementById("cPHr").textContent = c.toString();
    document.getElementById("uPHr").textContent = u.toString();
    document.getElementById("mPHr").textContent = timeString(true);
    document.getElementById("mPMi").textContent = timeString(false);

    let tmpBigCardXT = formatNumber(timeTotal, 2);
    let tmpBigCardIT = formatNumber(timeTotal + timeVat, 2);
    let tmpBigCardT = formatNumber(timeVat, 2);

    let dTotf = formatNumber(dTot, 2);
    let dVatf = formatNumber(dVat, 2);
    let dTotWVatf = formatNumber(dTot + dVat, 2);

    let tmp_gTot = formatNumber(grandTotal_exVat, 2);
    let tmp_gVat = formatNumber(grandTotal_vat, 2);
    let tmp_gInc = formatNumber(grandTotal_incVat, 2);

    let tmpChrgStr = `<div id="bigStuff-subT">Unit Charge:</div><div id="bigStuff-list">&pound;${tmpBigCardXT} excl VAT</br>&pound;${tmpBigCardT} VAT &commat; &percnt;${vat}<br>&pound;${tmpBigCardIT} incl VAT</div><br>`;
    if (disbursements.length > 0) {
        tmpChrgStr += `<div id="bigStuff-subT">Disbursements:</div><div id="bigStuff-list">&pound;${dTotf} excl VAT</br>&pound;${dVatf} VAT &commat; &percnt;${vat}<br>&pound;${dTotWVatf} incl VAT</div><br>`;
    }
    tmpChrgStr += `<div id="bigStuff-subT">Grand Total:</div><div id="bigStuff-list">&pound;${tmp_gTot} excl VAT</br>&pound;${tmp_gVat} VAT &commat; &percnt;${vat}<br>&pound;${tmp_gInc} incl VAT</div>`;

    document.getElementById("totalCharge").innerHTML = tmpChrgStr;

    // small screen table for VAT values
    let table = document.getElementById("sm-scr-vals");
    let row = table.getElementsByTagName("tr")[1];
    let excTTD = row.getElementsByTagName("td")[0];
    let incTTD = row.getElementsByTagName("td")[1];
    let valTTD = row.getElementsByTagName("td")[2];

    excTTD.innerHTML = '&pound;' + formatNumber(grandTotal_exVat, 2);
    incTTD.innerHTML = '&pound;' + formatNumber(grandTotal_incVat, 2);
    valTTD.innerHTML = '&pound;' + formatNumber(grandTotal_vat, 2);

    showDisbursementsTable();

    // medium screen and larger card for showing VAT values 
    
}


function formatNumber(num, decPlaces) {

    let numFormat = roundAccurately(num, decPlaces);

    return numFormat.toFixed(2);
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


function showDisbursementsTable() {
    let sbody = '';

    let tLength = disbursements.length;

    let section = document.getElementById("disbursements");
    let sm_section = document.getElementById("sm-disbursements");

    

    if (tLength < 1) {
        section.innerHTML = '';
        sm_section.innerHTML = '';
        return;
    }
    // display disbursements table header

    let dbCard_small = '<div class="row d-md-none d-block" id="smDisbCard"><div class="col-md-8 col-10 mx-auto"><div class="card"><div class="card-header" id="crdHdr"><div class="alignLeft">Disbursements</div><div class="alignRight"><button type="button" class="btn btn-outline-primary btn-sm" id="addDisbursement-sm" data-bs-toggle="modal" data-bs-target="#disburseModal"><i class="fa-solid fa-square-plus"></i></button><div style="clear: both"></div></div></div><div class="card-body">';

    let dbCard = '<div class="row d-none d-md-block"><div class="col-md-8 col-sm-6 mx-auto"><div class="card"><div class="card-header">Disbursements</div><div class="card-body"><table class="table table-responsive-sm text-center disburseTable" id="disburTable"><caption>* Coloured cells identify value entered and used to calculate other values</caption><thead class="table-primary"><tr><th scope="col">#</th><th scope="col">Title</th><th scope="col">Cost excl. VAT</th><th scope="col">VAT amnt.</th><th scope="col">Total incl. VAT</th><th scope="col"><button type="button" class="btn btn-outline-primary btn-sm" id="addDisbursement" data-bs-toggle="modal" data-bs-target="#disburseModal"><i class="fa-solid fa-square-plus"></i></button></th></tr></thead><tbody>';

    let body = '';

    let tmpNTot = 0;
    let tmpVTot = 0;
    let tmpWTot = 0;

    let v = 0;
    let n = 0;
    let w = 0;

    for (let row = 0; row < tLength; row++) {

        let line = `<tr><th scope="row">${row + 1}</th>`;
        let sm_line = ``;
        let clrStripe = '';

        let tmpTitle = disbursements[row][0];
        let tmpCost = Number(disbursements[row][1]);
        let vatTick = disbursements[row][2];
        let amnt = '';
        let vatAmnt = '';
        let cost = '';

        if (row % 2 != 0) {
            clrStripe = 'smDisbCard-on';
        } else {
            clrStripe = 'smDisbCard-off';
        }

        if (vatTick) {
            tmpVTot = roundAccurately((tmpCost / (100 + vat)) * vat, 2);
            tmpNTot = roundAccurately(tmpCost - tmpVTot, 2);
            tmpWTot = tmpCost;

            vatAmnt = formatNumber(tmpVTot, 2);
            amnt = formatNumber(tmpNTot, 2);
            cost = formatNumber(tmpWTot, 2);

            v += tmpVTot;
            n += tmpNTot;
            w += tmpWTot;

            line += `<td>${tmpTitle}</td><td>&pound;${amnt}</td><td>&pound;${vatAmnt}</td><td class="table-info">&pound;${cost}</td><td><button type="button" class="btn btn-outline-warning btn-sm" onclick="delDisbTblRow('disbTblRow` + row.toString() + `')"><i class="fa-solid fa-trash-can"></i></button></td></tr>`;
            sm_line += `<div class="smDisbBodyFirstTxt ${clrStripe} border border-dark border-1"><div class="alignLeft">${row + 1})&nbsp;${tmpTitle}</div><div class="alignRight"><button type="button" class="btn btn-outline-warning btn-sm" onclick="delDisbTblRow('disbTblRow-sm` + row.toString() + `')"><i class="fa-solid fa-trash-can"></i></button><div style="clear: both"></div></div><br><div class="smDisbBodyTxt">&pound;${amnt} excl VAT</div><div class="smDisbBodyTxt">&pound;${vatAmnt} &nbsp;VAT &commat; &percnt;${vat}</div><div class="smDisbBodyTxt bg-info border border-warning border-1 shadow rounded">&pound;${cost} incl VAT</div><br></div>`;
        } else {
            tmpVTot = roundAccurately((tmpCost / 100) * vat, 2);
            tmpNTot = tmpCost;
            tmpWTot = roundAccurately(tmpCost + tmpVTot, 2);

            vatAmnt = formatNumber(tmpVTot, 2);
            amnt = formatNumber(tmpNTot, 2);
            cost = formatNumber(tmpWTot, 2);

            v += tmpVTot;
            n += tmpNTot;
            w += tmpWTot;

            line += `<td>${tmpTitle}</td><td class="table-info">&pound;${amnt}</td><td>&pound;${vatAmnt}</td><td>&pound;${cost}</td><td><button type="button" class="btn btn-outline-danger btn-sm" onclick="delDisbTblRow('disbTblRow` + row.toString() + `')"><i class="fa-solid fa-trash-can"></i></button></td></tr>`;
            sm_line += `<div class="smDisbBodyFirstTxt ${clrStripe} border border-dark border-1"><div class="alignLeft">${row + 1}) &nbsp;${tmpTitle}</div><div class="alignRight"><button type="button" class="btn btn-outline-warning btn-sm" onclick="delDisbTblRow('disbTblRow-sm` + row.toString() + `')"><i class="fa-solid fa-trash-can"></i></button><div style="clear: both"></div></div><br><div class="smDisbBodyTxt bg-info border border-warning border-1 shadow rounded">&pound;${amnt} excl. VAT</div><div class="smDisbBodyTxt">&pound;${vatAmnt} &nbsp;VAT &commat; &percnt;${vat}</div><div class="smDisbBodyTxt">&pound;${cost} incl VAT</div><br></div>`;

        }


        // disbursements[row][3] = amnt;

        body += line;
        sbody += sm_line;

    }  

    tmpNTot = formatNumber(n, 2);
    tmpWTot = formatNumber(w, 2);
    tmpVTot = formatNumber(v, 2);

    body += '</tbody><tfoot><tr class="table-danger" id="disbTFoot"><th>TOTAL</th><td></td>';
    delDisbTblRow
    delDisbTblRow
    body += `<td>&pound;${tmpNTot}</td><td>&pound;${tmpVTot}</td><td>&pound;${tmpWTot}</td><td><button type="button" class="btn btn-outline-danger btn-sm" onclick="delDisbTblRow()"><i class="fa-solid fa-delete-left"></i></button></td>`;
    body += '</tr></tfoot></table></div></div></div></div>';

    sbody += `<div class="bg-warning border-1 border-rounded bsfoot"><div>Total excl. VAT &pound;${tmpNTot}</div><div>VAT &commat; &percnt;${vat} &pound;${tmpVTot}</div><div>Total incl. VAT &pound;${tmpWTot}</div></div><div class="bg-info shadow border border-primary border-1 rounded alignRight" id="hrMin_txt">&nbsp;Clear&nbsp;<button type="button" class="btn btn-outline-danger btn-sm" onclick="delDisbTblRow()"><i class="fa-solid fa-delete-left"></i></button><div style="clear: right"></div></div>`;
    let sfoot = `</div><div class="card-footer bsfoot" id="hrMin_txt">* Coloured cells identify value entered and used to calculate other values</div></div></div></div>`;

    sm_section.innerHTML = dbCard_small + sbody + sfoot;
    section.innerHTML = dbCard + body;

    return;
}


function addDisbursement() {

    if (Array.isArray(disbursements) === false) { disbursements = []; }

    let tLength = disbursements.length;

    disbursements[tLength] = [];

    let formInput = modalDisbForm.querySelectorAll('input');

    tLength = disbursements[tLength].push(formInput[0].value, Number(formInput[1].value), Boolean(formInput[2].checked));

    // console.log(disbursements);

    doUpdatePage();

}


function delDisbTblRow(delBtnId) {

    if (delBtnId === undefined) {
        if (confirm("Do you really want to Delete ALL disbursements?")) {
            disbursements = [];
        }
    } else {
        let tmpId = parseInt(delBtnId.replace('disbTblRow'));
        if (isNaN(tmpId)) {
            tmpId = parseInt(delBtnId.replace('disbTblRow-sm'));
            if (isNaN(tmpId)) { tmpId = 0; }
        }

        disbursements.splice(tmpId, 1);
    }

    doUpdatePage();
}