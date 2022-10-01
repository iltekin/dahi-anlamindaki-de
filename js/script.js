if(CSS.registerProperty !== undefined){
    CSS.registerProperty({
        name: "--p",
        syntax: "<integer>",
        initialValue: 0,
        inherits: true,
    });
    document.getElementById("certPercent").style.display = "block";
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('.');
}

function toNameCase(str) {
    return str.split(' ')
        .map(w => w[0].toLocaleUpperCase('tr-TR') + w.substring(1).toLocaleLowerCase('tr-TR'))
        .join(' ');
}

function enco(str){
    return CryptoJS.AES.encrypt(str, "not-a-secret").toString();
}

function deco(encrypted){
    var decrypted = CryptoJS.AES.decrypt(encrypted, "not-a-secret");
    return decrypted.toString(CryptoJS.enc.Utf8);
}

let shared = false;

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function checkShared() {

    WebFont.load({
        google: {
            families: ['Parisienne:400:latin-ext', 'Roboto Mono', 'Recursive']
        }
    });

    let abort = false;
    let parameters = {};
    const shareParams = ["n", "d", "c", "t"];

    const queryString = window.location.search;

    if(queryString.length > 0) {
        const urlParams = parseQuery(queryString);
        for (const param of shareParams) {
            if (!urlParams[param] || deco(urlParams[param]).length === 0) {
                abort = true;
                console.log("Aborted: " + urlParams[param]);
            } else {
                parameters[param] = deco(urlParams[param]);
            }
        }
    } else {
        abort = true;
    }

    if(!abort) {
        drawImage(parameters["n"], parameters["d"], parameters["c"], parameters["t"]);
        shared = true;
    }


}

window.addEventListener('load', function() {

    WebFont.load({
        google: {
            families: ['Parisienne:400:latin-ext', 'Roboto Mono', 'Recursive']
        }
    });

    const screenWidth = screen.width;
    const certificateContainer = document.getElementById('certificateContainer');
    if(screenWidth < 720){
        certificateContainer.style.zoom = screenWidth / 1920 / 1.13;
    } else {
        certificateContainer.style.zoom = screenWidth / 1920 / 2;
    }
    document.getElementById("timeLeft").innerText = totalAnswerTime;
    document.getElementById("qLimit").innerText = quizLimit.toString();

    checkShared();
    getHitNumber();
})

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let name = "";
let start = "";
let totalTime = "";
const today = formatDate(new Date());
const downloadBtn = document.getElementById('download-btn');

const image = new Image();
image.src = 'image/certificate.jpg';

function drawImage(name, date, certificateNumber, totalTime) {

    name = toNameCase(name);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.font = '150px Parisienne';
    ctx.fillStyle = '#001439';
    ctx.textAlign = "center";
    ctx.fillText(name, 950, 930);

    ctx.font = '40px Roboto Mono';
    ctx.fillText(date, 350, 1200);
    ctx.fillText(certificateNumber, 1540, 1200);

    ctx.fillStyle = '#E7C76C';
    ctx.font = '50px Recursive';
    ctx.fillText(totalTime, 930, 470);

    document.getElementById("qc").style.display = "none";
    document.getElementById("loader").style.display = "block";
    document.getElementById("copy-btn").href = "https://" + domain + "?n=" + enco(name) + "&d=" + enco(date) + "&c=" + enco(certificateNumber.toString()) + "&t=" + enco(totalTime.toString());

    let keyboard = new Audio("sound/keyboard.mp3");
    keyboard.play();

    setTimeout(function() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("certificateContainer").style.display = "block";
        let created = new Audio("sound/created.mp3");
        created.play();
    }, 10000);
}

downloadBtn.addEventListener('click', function () {
    downloadBtn.href = canvas.toDataURL('image/jpg')
    downloadBtn.download = "sertifika- " + name + "-" + domain + ".jpg";
});

function clearLiHighlights(){
    document.querySelectorAll('.selectedAnswer').forEach(item => {
        item.classList.remove("selectedAnswer");
    });
}

document.querySelectorAll('li').forEach(item => {
    item.onclick =  function() {
        playNow("select");
        clearLiHighlights();
        item.classList.add("selectedAnswer");
        item.children[0].checked = true;
    }
});


function createProgressbar(id, duration, callback) {
    // We select the div that we want to turn into a progressbar
    let progressbar = document.getElementById(id);
    progressbar.className = 'progressbar';

    // We create the div that changes width to show progress
    let progressbarinner = document.createElement('div');
    progressbarinner.className = 'inner';

    // Now we set the animation parameters
    progressbarinner.style.animationDuration = duration;

    // Eventually couple a callback
    if (typeof(callback) === 'function') {
        progressbarinner.addEventListener('animationend', callback);
    }

    // Append the progressbar to the main progressbardiv
    progressbar.appendChild(progressbarinner);

    // When everything is set up we start the animation
    progressbarinner.style.animationPlayState = 'running';
}

const welcomeMessage = document.getElementById("welcome-message");
const quizElement = document.getElementById("quiz");
const startButton = document.getElementById("start");
const timeLeft = document.getElementById("timeLeft");
const questionInfo = {};
let counter;

questionInfo.parent = document.getElementById("questionInfo");
questionInfo.qNumber = document.getElementById("qNumber");
questionInfo.qLimit = document.getElementById("qLimit");

const afterTime = function() {
    playNow("failed");
    quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                <div class="result-inner">
                    Belirlenen süre içinde soruyu cevaplayamadınız. Bu yüzden test sona erdi.
                </div>
                </div>
                <button class="blue-gradient" onclick="location.reload()">Yeniden Dene</button>
           `
};

function startTime(){
    stopTime();
    createProgressbar('time-progressbar', totalAnswerTime + 's', afterTime);
}

function stopTime(){
    let bar = document.getElementById("time-progressbar");
    bar.removeEventListener("animationend", afterTime, true);
    bar.innerHTML = "";
}

document.getElementById("info").addEventListener('click', function () {
    this.classList.toggle("open");
    document.getElementById("menuContents").classList.toggle("hideThis");
    document.getElementById("questionMark").classList.toggle("hideThis");
    document.getElementById("closeIcon").classList.toggle("hideThis");
})

startButton.addEventListener('click', function () {
    welcomeMessage.style.display = "none";
    quizElement.style.display = "block";

    loadQuiz();
    startTime();
    counter = setInterval(timer, 1000);
    start = new Date();

    getHitNumber(true);

})

function getHitNumber(add = false) {
    let xhr = new XMLHttpRequest();
    if(add){
        xhr.open("GET", "https://api.countapi.xyz/hit/" + domain + "/hit");
    } else {
        xhr.open("GET", "https://api.countapi.xyz/info/" + domain + "/hit");
    }
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById("hits").innerText = String(this.response.value);
        appendTotalCertificateNumber();
    }
    xhr.send();
}


function appendTotalCertificateNumber() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.countapi.xyz/info/" + domain);
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById("certificates").innerText = String(this.response.value);
        document.getElementById("success_rate").style.display = "block";
    }
    xhr.send();
}


function getCertificateNumber(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.countapi.xyz/hit/" + domain);
    xhr.responseType = "json";
    xhr.onload = function() {
        let certificateNumber = String(this.response.value).padStart(8, "0");
        drawImage(name, today, certificateNumber, totalTime);
        appendTotalCertificateNumber();
    }
    xhr.send();
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

shuffle(quizData);

const quiz = document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const sender = document.getElementById('sender')
const submitBtn = document.getElementById('submit')

let currentQuiz = 0
let score = 0
let totalAnswerTime = quizLimit * answerTime;

function loadQuiz() {
    deselectAnswers()

    const currentQuizData = quizData[currentQuiz]

    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d

    if(currentQuizData.sender){
        sender.innerText = "Gönderen: " + currentQuizData.sender;
    } else {
        sender.innerText = "";
    }

    questionInfo.qNumber.innerText = (currentQuiz + +1).toString();
    questionInfo.qLimit.innerText = quizLimit.toString();
}

function timer(){
    totalAnswerTime = totalAnswerTime-1;
    if (totalAnswerTime < 0){
        clearInterval(counter);
        return;
    }
    timeLeft.innerText = totalAnswerTime;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
}

function getSelected() {
    let answer

    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })

    return answer
}

function playNow(sound) {
    let audio = document.getElementById(sound);
    audio.play();
}

function getName() {
    let nameInput = document.getElementById("name");
    let nameValue = nameInput.value;

    if(nameValue === "" || nameValue === undefined){
        nameInput.placeholder = "Buraya adınızı yazmalısınız";
        playNow("invalid");
    } else {
        getCertificateNumber(nameValue)
    }
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected()
    if(answer) {
        let widthInPercent = currentQuiz * (100/quizLimit) + (100/quizLimit);
        document.getElementById("progress-bar").style.width = widthInPercent + "%";
        if(answer === quizData[currentQuiz].correct) {
            score++
        }

        currentQuiz++

        if(currentQuiz < quizLimit) {
            loadQuiz();
            clearLiHighlights();
            playNow("next");
        } else {

            clearInterval(counter);
            let endDate = new Date();
            totalTime = Math.floor((endDate.getTime() - start.getTime()) / 1000);

            stopTime();
            if(score < quizLimit){
                playNow("failed");
                quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                <div class="result-inner">
                    ${quizLimit} sorunun ${score} tanesini doğru cevapladınız. Sertifika alabilmek için tamamını doğru cevaplamalısınız. Dahi anlamındaki de ve ek olan -de konusuna biraz daha çalışmanız gerekiyor.
                </div>
                </div>
                <button class="blue-gradient" onclick="location.reload()">Yeniden Dene</button>
           `
            } else {
                let tada = new Audio("sound/tada.mp3");
                tada.play();
                quiz.innerHTML = `
                <div id="result">
                <h2>Tebrikler!</h2>
                <div class="result-inner">
                    ${quizLimit} sorunun tamamını doğru cevapladınız.
                    <input type="text" id="name" name="name" placeholder="Ad Soyad">
                </div>
                </div>
                <button class="blue-gradient" onclick="getName()">Sertifikamı Oluştur</button>
            `
            }
        }
    } else {
        playNow("invalid");
    }
})