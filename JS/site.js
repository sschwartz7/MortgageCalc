function getNum() {
    let loan = parseFloat(document.getElementById('loanAmount').value);
    let term = parseInt(document.getElementById('Term').value);
    let rate = parseFloat(document.getElementById('Rate').value);
    if (isNaN(loan) || isNaN(term) || isNaN(rate) || loan <= 0 || term <= 0 || rate <= 0) {
        Swal.fire('Please enter valid loan details')
    } else {
        let payments = CreatePaymentObj(loan, term, rate);
        displayPTable(payments);
        displayTotals(loan, payments);
    }
}

function displayPTable(payments) {//change to display table

    //find table on page
    const paymentTable = document.getElementById('paymentTable');
    //find table row template
    const paymentTemplate = document.getElementById('table-row-template');
    //clear out table
    paymentTable.innerHTML = '';

    for (let index = 0; index < payments.length; index++) {
        //get one event
        let month = payments[index];
        //clone template
        let tableRow = paymentTemplate.content.cloneNode(true);
        //get each property of an event and insert each property into the cloned template
        tableRow.querySelector('[data-id="month"]').innerText = month.month;
        tableRow.querySelector('[data-id="payment"]').innerText = month.payment.toLocaleString("en-US", { style: "currency", currency: "USD" });
        tableRow.querySelector('[data-id="principle"]').innerText = month.principle.toLocaleString("en-US", { style: "currency", currency: "USD" });
        tableRow.querySelector('[data-id="interest"]').innerText = month.interest.toLocaleString("en-US", { style: "currency", currency: "USD" });
        tableRow.querySelector('[data-id="tInterest"]').innerText = month.tInterest.toLocaleString("en-US", { style: "currency", currency: "USD" });
        tableRow.querySelector('[data-id="balance"]').innerText = month.balance.toLocaleString("en-US", { style: "currency", currency: "USD" });
        //insert the event data into the table
        paymentTable.appendChild(tableRow);
    }
}

function displayTotals(principle, payments) {

    document.getElementById("monthlyPay").innerHTML = payments[0].payment.toLocaleString("en-US", { style: "currency", currency: "USD" });
    document.getElementById('principle').innerHTML = principle.toLocaleString("en-US", { style: "currency", currency: "USD" });
    document.getElementById('interest').innerHTML = payments[payments.length - 1].tInterest.toLocaleString("en-US", { style: "currency", currency: "USD" });
    document.getElementById('cost').innerText = (principle + payments[payments.length - 1].tInterest).toLocaleString("en-US", { style: "currency", currency: "USD" });

}

function CreatePaymentObj(loan, term, rate) {
    let payments = [];
    let balance = loan;
    let tInterest = 0;
    tMonthlyPayment = (loan * (rate / 1200)) / (1 - (1 + (rate / 1200)) ** -term);//Math.pow((rate/1200), -term) instead of **
    for (let i = 1; i <= term; i++) {
        let interest = (balance * (rate / 1200));
        tInterest = tInterest + interest;//+= interest;
        let principle = tMonthlyPayment - interest;
        balance = balance + interest - tMonthlyPayment;//-=principle;
        if (balance <= 0) {
            balance = 0;
        }
        let newPayment = {
            month: i,
            payment: tMonthlyPayment,
            principle: principle,
            interest: interest,
            tInterest: tInterest,
            balance: balance,
        };
        payments.push(newPayment);
    }
    return payments;
}

