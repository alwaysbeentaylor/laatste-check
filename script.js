const CONFIG = {
    // 1. Maak een bot aan via @BotFather in Telegram en plak de token hieronder.
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',

    // 2. Start een chat met je bot, ga naar https://api.telegram.org/bot<TOKEN>/getUpdates om je ID te vinden.
    CHAT_ID: 'YOUR_CHAT_ID_HERE'
};

let currentStep = 0;
const totalSteps = 6;

window.answers = {
    hoofddoel: [],
    succes_definitie: '',
    frustraties: '',

    brand_vibe: [],
    sfeer: [],
    kleuren: [],

    focus_punt: [],
    menu_weergave: [],
    online_bestellen: false,

    socials: [],
    content_creation: [],
    post_frequentie: '',
    review_strategie: false,

    budget_type: [],
    beslisser: '',
    deadline: ''
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateProgress();
        console.log("App ready");
    } catch (e) {
        console.error(e);
        alert("Startup error: " + e.message);
    }
});

// Make globally available to ensure HTML onClick works
window.nextStep = function () {
    console.log("Next step triggered", currentStep);

    try {
        if (!validateStep(currentStep)) return;
        saveInputs(currentStep);

        if (currentStep < totalSteps) {
            changeStep(currentStep + 1);
        }
    } catch (e) {
        console.error(e);
        alert("Error in nextStep: " + e.message);
    }
};

window.prevStep = function () {
    if (currentStep > 0) {
        changeStep(currentStep - 1);
    }
};

function changeStep(newStep) {
    const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (currentEl) currentEl.classList.remove('active');

    setTimeout(() => {
        currentStep = newStep;
        const nextEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (nextEl) nextEl.classList.add('active');
        updateProgress();
        // Scroll to top
        window.scrollTo(0, 0);
    }, 300);
}

function updateProgress() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    let pct = (currentStep / (totalSteps - 1)) * 100;
    if (currentStep === 0) pct = 5;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
}

function saveInputs(step) {
    // Only try to get value if element exists to avoid NULL refs
    const safeVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };
    const safeCheck = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    if (step >= 0) { // Check always to be safe
        if (document.getElementById('succes_definitie')) window.answers.succes_definitie = safeVal('succes_definitie');
        if (document.getElementById('frustraties')) window.answers.frustraties = safeVal('frustraties');

        if (document.getElementById('online_bestellen')) window.answers.online_bestellen = safeCheck('online_bestellen');

        if (document.getElementById('post_frequentie')) window.answers.post_frequentie = safeVal('post_frequentie');
        if (document.getElementById('review_strategie')) window.answers.review_strategie = safeCheck('review_strategie');

        if (document.getElementById('beslisser')) window.answers.beslisser = safeVal('beslisser');
        if (document.getElementById('deadline')) window.answers.deadline = safeVal('deadline');
    }
}

function validateStep(step) {
    // Step 0 always pass
    if (step === 0) return true;
    return true;
}

// Global Toggle Function
window.toggleSelection = function (el, key, value) {
    if (!el) return;
    el.classList.toggle('selected');

    const idx = window.answers[key].indexOf(value);

    if (el.classList.contains('selected')) {
        if (idx === -1) window.answers[key].push(value);
    } else {
        if (idx > -1) window.answers[key].splice(idx, 1);
    }
};

window.toggleTag = function (el, key) {
    window.toggleSelection(el, key, el.innerText);
};

window.finishForm = function () {
    saveInputs(5);

    const a = window.answers; // alias

    // Convert arrays to nice strings
    const join = (arr) => arr && arr.length ? arr.join(', ') : '-';

    const msg = `
🚀 *Laatste Details: Tanoshi Sushi*

1️⃣ *Doel*
• Doelen: ${join(a.hoofddoel)}
• Succes: "${a.succes_definitie || '-'}"
• Frustraties: "${a.frustraties || '-'}"

2️⃣ *Vibe & Stijl*
• Gevoel: ${join(a.brand_vibe)}
• Stijlkeuze: ${join(a.sfeer)}
• Kleuren: ${join(a.kleuren)}

3️⃣ *Menu*
• Prio: ${join(a.focus_punt)}
• Weergave: ${join(a.menu_weergave)}
• Online bestellen: ${a.online_bestellen ? 'Ja' : 'Nee'}

4️⃣ *Bereik*
• Socials: ${join(a.socials)}
• Content Hulp: ${join(a.content_creation)}
• Post freq: ${a.post_frequentie || '-'}
• Reviews: ${a.review_strategie ? 'Actief campagne' : 'Passief'}

5️⃣ *Samenwerking*
• Voorkeur: ${join(a.budget_type)}
• Beslisser: ${a.beslisser || '-'}
• Deadline: ${a.deadline || '-'}

_Verstuurd via mobiele app_
    `;

    sendToTelegram(msg);
    changeStep(6);
};


function sendToTelegram(text) {
    if (CONFIG.BOT_TOKEN.includes('YOUR_BOT_TOKEN')) {
        console.warn('Telegram token not set.');
        return;
    }

    const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage?chat_id=${CONFIG.CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    fetch(url, { mode: 'no-cors' })
        .then(() => console.log('Sent'))
        .catch(err => console.log('Error', err));
}
