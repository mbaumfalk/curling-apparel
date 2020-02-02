const data = [
    {name: "Red Sweatshirts", receiptName: "Hoodie (list sizes here)", cost: 20},
    {name: "Grey Crewnecks", receiptName: "Crewneck (list sizes here)", cost: 20},
    {name: "Hats", receiptName: "Hat", cost: 15},
    {name: "Black Longsleeve Ts", receiptName: "CBR Long (list sizes here)", cost: 20},
    {name: "Black Shortsleeve Ts", receiptName: "CBR Short (list sizes here)", cost: 15},
    {name: "Red Ts", receiptName: "Red T (list sizes here)", cost: 20},
    {name: "Baseball Hat", receiptName: "Baseball Hat", cost: 25},
    {name: "New Grey Crewneck", receiptName: "New Crewneck (list sizes here)", cost: 25},
];
const taxRate = 0.075;

function setAmount(element, amount) {
    const dollars = String(amount).padStart(3,0);
    element.children[3].innerText = dollars.substring(0, dollars.length-2);
    element.children[4].innerText = String(amount%100).padStart(2, 0);
}

function update() {
    const receipt = document.getElementById("receipt");

    for (let i = 2; i < 17; i++) {
        for (let j = 1; j < 5; j++)
            receipt.children[i].children[j].innerText = "";
    }
    let total = 0;
    const items = [];
    for (const item of data) {
        const element = document.getElementById("input." + item.name);
        const cost = Number(element.value) * item.cost * 100;
        total += cost;
        if (cost > 0) {
            items.push(cost);
            receipt.children[items.length+1].children[1].innerText = element.value + " - " + item.receiptName;
        }
    }
    if (items.length == 0) return;

    let subtotal = 0;
    for (const i in items) {
        items[i] = Math.round(items[i] / (1+taxRate));
        subtotal += items[i];
    }

    let subtotal1 = Math.round(total / (1+taxRate));
    if (Math.round(subtotal1*(1+taxRate)) % 100 != 0) {
        subtotal1++;
    }
    items[0] += subtotal1 - subtotal;

    const tax = Math.round(subtotal1*taxRate);

    let i = 2;
    for (const item of items) {
        setAmount(receipt.children[i], item);
        i++;
    }
    receipt.children[i].children[2].innerText = "Tax";
    setAmount(receipt.children[i], tax);
    receipt.children[i+2].children[2].innerText = "Total";
    setAmount(receipt.children[i+2], subtotal1 + tax);
}

function initInput() {
    const span = document.getElementById("input");
    span.oninput = update;
    for (const item of data) {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        name.appendChild(document.createTextNode(item.name + " ($" + item.cost + ")"));
        row.appendChild(name);

        const input = document.createElement("td");
        const element = document.createElement("input");
        element.id = "input." + item.name;
        element.type = "number";
        element.value = 0;
        element.min = 0;
        input.appendChild(element);

        const plus = document.createElement("input");
        plus.type = "button";
        plus.value = "+";
        plus.onclick = () => { element.value++; update(); };
        input.appendChild(plus);
        row.appendChild(input);

        span.appendChild(row);
    }
}

function initReceipt() {
    const receipt = document.getElementById("receipt");
    receipt.border = 1;

    const colgroup = document.createElement("colgroup");
    const width = [28, 263, 90, 66, 39];
    for (const i in width) {
        const col = document.createElement("col");
        col.style = "width: " + width[i] + "px";
        colgroup.appendChild(col);
    }
    receipt.appendChild(colgroup);

    const header = document.createElement("tr");
    for (let i = 0; i < 4; i++) {
        header.appendChild(document.createElement("th"));
    }
    header.children[0].setAttribute("colspan", 2);
    header.children[0].innerText = "Reg. No.           \xa0\xa0\xa0\xa0\xa0                  Clerk";
    header.children[1].innerText = "Acct. Fwd.";
    receipt.appendChild(header);

    for (let i = 1; i < 16; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 5; j++) {
            row.appendChild(document.createElement("td"));
        }
        row.children[0].innerText = i;
        row.children[3].align = "right";
        receipt.appendChild(row);
    }
}

function init() {
    initInput();
    initReceipt();
    update();
}

function reset() {
    for (const item of data) {
        document.getElementById("input." + item.name).value = 0;
    }
    update();
}
