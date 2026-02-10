let currentExp = ""; 
let isFinished = false; 
let lastFullExp = ""; 
let editMode = false;

// UI Update
function updateUI() {
    const ansLine = document.getElementById('answer-line');
    const calcLine = document.getElementById('calculation-line');
    let formattedExp = currentExp.toString()
        .replace(/\*/g, '×').replace(/\//g, '÷')
        .replace(/\d+(\.\d+)?/g, (num) => Number(num).toLocaleString());
    calcLine.innerText = formattedExp;
    try {
        if (currentExp && !['+', '-', '*', '/', '%'].includes(currentExp.toString().slice(-1))) {
            let res = eval(currentExp);
            ansLine.innerText = res.toLocaleString();
        } else if (!currentExp) {
            ansLine.innerText = "0";
        }
    } catch(e) {}
}

// Input Functions
function addNum(num) {
    if (isFinished) { currentExp = ""; isFinished = false; document.getElementById('answer-line').classList.remove('final-answer'); }
    currentExp += num;
    updateUI();
}

function addOperator(op) {
    const lastChar = currentExp.toString().slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        currentExp = currentExp.slice(0, -1) + op;
    } else {
        currentExp += op;
    }
    isFinished = false;
    updateUI();
}

function calculate() {
    if (!currentExp) return;
    try {
        let res = eval(currentExp);
        lastFullExp = currentExp;
        document.getElementById('answer-line').innerText = "= " + res.toLocaleString();
        document.getElementById('answer-line').classList.add('final-answer');
        saveToHistory(currentExp.replace(/\*/g, '×').replace(/\//g, '÷') + " =", res.toLocaleString());
        currentExp = res.toString();
        isFinished = true;
    } catch(e) { console.log("Error"); }
}

function allClear() { 
    currentExp = ""; 
    document.getElementById('calculation-line').innerText = ""; 
    document.getElementById('answer-line').innerText = "0"; 
    document.getElementById('answer-line').classList.remove('final-answer');
}

function back() {
    if (isFinished) {
        currentExp = lastFullExp;
        isFinished = false;
        document.getElementById('answer-line').classList.remove('final-answer');
        updateUI();
    } else {
        currentExp = currentExp.toString().slice(0, -1);
        updateUI();
    }
}

// History Functions
function openHistory() { document.getElementById('history-panel').style.display = 'flex'; loadHistory(); }
function closeHistory() { document.getElementById('history-panel').style.display = 'none'; if(editMode) toggleEditMode(); }

function saveToHistory(exp, res) {
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.unshift({ id: Date.now(), exp, res, date: new Date().toLocaleDateString('en-GB') });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
}

function loadHistory() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    list.innerHTML = history.map(item => `
        <div class="history-card" id="card-${item.id}">
            <input type="checkbox" class="select-checkbox" value="${item.id}">
            <div onclick="recalculate('${item.exp}')">
                <div style="font-size:12px; color:#888;">${item.exp}</div>
                <div style="font-size:18px; font-weight:bold;">${item.res}</div>
            </div>
            <button onclick="copyValue('${item.res}')">Copy</button>
        </div>
    `).join('') || "<p style='text-align:center;'>No History</p>";
}

function recalculate(exp) {
    currentExp = exp.replace(/,/g, '').replace(/=/g, '').replace(/×/g, '*').replace(/÷/g, '/').trim();
    isFinished = false;
    updateUI();
    closeHistory();
}

function copyValue(val) {
    navigator.clipboard.writeText(val.replace(/,/g, ''));
    alert("Copied!");
}

function toggleEditMode() {
    editMode = !editMode;
    document.querySelectorAll('.select-checkbox').forEach(cb => cb.style.display = editMode ? 'inline' : 'none');
    document.getElementById('history-footer').style.display = editMode ? 'block' : 'none';
    document.getElementById('edit-btn').innerText = editMode ? 'Cancel' : 'Clear';
}
