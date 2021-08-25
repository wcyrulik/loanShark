// Get values entered by the user from the page.
function getValues() {
    
    let loanData = {
        loanAmt: 0.0,
        term: 0,
        monthlyPmt: 0.0,
        totalInterest: 0.0,
        totalCost: 0.0,
        monthlyRate: 0.0,
        pmtNo: [],
        payment: [],
        principal: [],
        interest: [],
        interestToDate: [],
        balance: []
    }
    loanData.loanAmt = Number.parseInt(document.getElementById("loanAmount").value);
    loanData.term = Number.parseInt(document.getElementById("noOfPayments").value);
    let mrate = document.getElementById("rate").value ;
    mrate = mrate / 1200;
    loanData.monthlyRate = mrate;

    loanData = calculatePayments(loanData);

    displayResults(loanData);
}
function calculatePayments(loanData) {

    // P = L[c(1 + c)n]/[(1 + c)n - 1]
    loanData.monthlyPmt = (loanData.loanAmt * (loanData.monthlyRate * 
        (1 + loanData.monthlyRate) ** loanData.term)
        / ((1 + loanData.monthlyRate) ** loanData.term - 1)).toFixed(2);
    
    let remainingBalance = loanData.loanAmt ;
    let totalInt = 0;
    let prin = 0;
    let int = 0;
    let pmt = loanData.monthlyPmt;
    let rate = loanData.monthlyRate;

    for (let i = 1; i <= loanData.term; i++ ){
        loanData.pmtNo.push(i);
        loanData.payment.push(pmt);
        if (i == loanData.term) {
            prin = remainingBalance;
            int = pmt - prin;
        } else {
            int = remainingBalance * rate;
            prin = pmt - int;
        }
        totalInt += int;
        loanData.interest.push(int);
        loanData.principal.push(prin);
        loanData.interestToDate.push(totalInt);
        remainingBalance -= prin;
        loanData.balance.push(remainingBalance);
    }
    loanData.totalInterest = totalInt;
    loanData.totalCost = loanData.loanAmt + totalInt;

    return loanData;
}

function displayResults(loanData) {
    
    document.getElementById("paymentAmount").innerHTML 
        = `${formatMoney(loanData.monthlyPmt, 2, "$")}`;
    loanData.loanAmt = formatMoney(loanData.loanAmt, 2, "$");
    document.getElementById("loanAmt").innerHTML = `${loanData.loanAmt}`;
    document.getElementById("totalInterest").innerHTML 
        = `${formatMoney(loanData.totalInterest,2,"$")}`;
    document.getElementById("totalCost").innerHTML  
        = `<strong> ${formatMoney(loanData.totalCost,2,"$")} </strong>`;

    // Build each row in the amortization schedule
    //get the table body element from the page
    let tableBody = document.getElementById("amortization");

    //get the row from the template
    let templateRow = document.getElementById("amTemplate");

    //clear table first
    tableBody.innerHTML = "";

    for (let i = 0; i < loanData.term; i++) {
        let tableRow = document.importNode(templateRow.content, true);
        //grab only the columns in the template
        let rowCols = tableRow.querySelectorAll("td");

        rowCols[0].textContent = loanData.pmtNo[i];
        rowCols[1].textContent = loanData.payment[i]; 
        rowCols[2].textContent = formatMoney(loanData.principal[i],2);
        rowCols[3].textContent = formatMoney(loanData.interest[i],2);   
        rowCols[4].textContent = formatMoney(loanData.interestToDate[i],2);
        rowCols[5].textContent = formatMoney(loanData.balance[i],2);

        tableBody.appendChild(tableRow);
    }

}
function formatMoney(number, decPlaces, dlrSign) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    dlrSign = typeof dlrSign === "undefined" ? "" : dlrSign;
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var sign = number < 0 ? "-" : "";
    let formattedString = '';

    formattedString = dlrSign + sign +
        number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedString ;

 }