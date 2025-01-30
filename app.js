const BASE_URL = "https://api.exchangeratesapi.io/v1/latest?access_key=961bd5d89f3ab2169ad2dde5ca685d0f";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);

        select.addEventListener("change", (e) => {
            updateFlag(e.target);
        });
    }
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        let response = await fetch(BASE_URL);
        let data = await response.json();

        if (!data.success) {
            msg.innerText = "Failed to fetch exchange rates.";
            return;
        }

        let rates = data.rates;
        let fromRate = rates[fromCurr.value];
        let toRate = rates[toCurr.value];

        if (!fromRate || !toRate) {
            msg.innerText = "Exchange rate not available.";
            return;
        }

        let finalAmt = (amtVal / fromRate) * toRate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate.";
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
