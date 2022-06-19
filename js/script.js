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

WebFont.load({
    google: {
        families: ['Parisienne:400:latin-ext', 'Roboto Mono', 'Recursive']
    }
});

window.addEventListener('load', function() {
    const screenWidth = screen.width;
    const certificateContainer = document.getElementById('certificateContainer');
    if(screenWidth < 720){
        certificateContainer.style.zoom = screenWidth / 1920 / 1.13;
    } else {
        certificateContainer.style.zoom = screenWidth / 1920 / 2;
    }
    document.getElementById("timeLeft").innerText = totalAnswerTime;
    document.getElementById("qLimit").innerText = quizLimit.toString();
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
    document.getElementById("certificateContainer").style.display = "block";
}

downloadBtn.addEventListener('click', function () {
    downloadBtn.href = canvas.toDataURL('image/jpg')
    downloadBtn.download = 'sertifika- ' + name + '-dahianlamindaki.de.jpg';
});

document.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', function() {

        document.querySelectorAll('.selectedAnswer').forEach(item2 => {
            item2.classList.remove("selectedAnswer");
        });

        item.classList.add("selectedAnswer");
    })
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
    playSound("failed");
    quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                Belirlenen süre içinde soruyu cevaplayamadınız. Bu yüzden test sona erdi.
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

document.getElementById("hamburger").addEventListener('click', function () {
    this.classList.toggle("open");
    document.getElementById("menuContents").classList.toggle("hideThis");
})

startButton.addEventListener('click', function () {
    welcomeMessage.style.display = "none";
    quizElement.style.display = "block";

    loadQuiz();
    startTime();
    //counter = setInterval(timer, 1000);
    start = new Date();
})

function getCertificateNumber(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.countapi.xyz/hit/dahianlamindaki.de/test");
    xhr.responseType = "json";
    xhr.onload = function() {
        let certificateNumber = String(this.response.value).padStart(8, "0");
        drawImage(name, today, certificateNumber, totalTime);
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

let sound = {
    failed: new Audio('sound/failed.mp3'),
    invalid: new Audio('sound/invalid.mp3'),
    select: new Audio('sound/select.mp3'),
    next: new Audio('sound/next.mp3'),
}

function playSound(file){
    sound[file].play();
}

function getName() {
    let nameInput = document.getElementById("name");
    let nameValue = nameInput.value;

    if(nameValue === "" || nameValue === undefined){
        nameInput.placeholder = "Buraya adınızı yazmalısınız";
        playSound("invalid");
    } else {
        getCertificateNumber(nameValue)
    }
}

document.querySelectorAll('.answer').forEach(item => {
    item.addEventListener('click', function() {
        playSound("select");
    })
});

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
            playSound("next");
        } else {

            clearInterval(counter);
            let endDate = new Date();
            totalTime = Math.floor((endDate.getTime() - start.getTime()) / 1000);

            stopTime();
            if(score < quizLimit){
                playSound("failed");
                quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                ${quizLimit} sorunun ${score} tanesini doğru cevapladınız. Sertifika alabilmek için tamamını doğru cevaplamalısınız. Dahi anlamındaki de ve ek olan -de konusuna biraz daha çalışmanız gerekiyor.
                </div>
                <button class="blue-gradient" onclick="location.reload()">Yeniden Dene</button>
           `
            } else {
                quiz.innerHTML = `
                <div id="result">
                <h2>Tebrikler!</h2>
                <h3>${quizLimit} sorunun tamamını doğru cevapladınız.</h3>
                <input type="text" id="name" name="name" placeholder="Ad Soyad">
                </div>
                <button class="blue-gradient" onclick="getName()">Sertifikamı Oluştur</button>
            `
            }
        }
    } else {
        playSound("invalid");
    }
})