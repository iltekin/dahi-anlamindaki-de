const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const screenWidth = screen.width;
let testerName = "";
let start = "";
let totalTime = "";
let tried = localStorage.getItem('tried') || 1;
const today = formatDate(new Date());
const downloadBtn = document.getElementById('download-btn');
const downloadBtn2 = document.getElementById('download-btn-komili');

const image = new Image();
image.src = 'image/certificate.png?v=1';

const image2 = new Image();
image2.src = 'image/certificate-komili.png?v=1';

if(CSS.registerProperty !== undefined){
    CSS.registerProperty({
        name: "--p",
        syntax: "<integer>",
        initialValue: 0,
        inherits: true,
    });
    document.getElementById("certPercent").style.display = "block";
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

    try {
        return str.split(' ')
            .map(w => w[0].toLocaleUpperCase('tr-TR') + w.substring(1).toLocaleLowerCase('tr-TR'))
            .join(' ');
    } catch (e) {
        return str
    }

}

window.addEventListener('load', function() {

    WebFont.load({
        google: {
            families: ['Parisienne:400:latin-ext', 'Roboto Mono', 'Recursive']
        }
    });

    const certificateContainer = document.getElementById('certificateContainer');
    if(screenWidth < 720){
        certificateContainer.style.zoom = screenWidth / 1920 / 1.13;
    } else {
        certificateContainer.style.zoom = screenWidth / 1920 / 2;
    }
    document.getElementById("timeLeft").innerText = totalAnswerTime;
    document.getElementById("qLimit").innerText = quizLimit.toString();

    getHitNumber();
})

function createDots() {
    let dots = "";
    for(i=0; i<tried; i++) {
        dots += "."
    }
    return dots;
}

function increaseTried() {
    tried++;
    localStorage.setItem('tried', tried);
}

function drawImage(name, date, certificateNumber, totalTime) {

    theName = toNameCase(name);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    let countChars = theName.length;
    if(countChars <= 15){
        ctx.font = '150px Parisienne';
    } else {
        actualFontSize = 150 - (countChars - 15) * 5;
        ctx.font = actualFontSize + 'px Parisienne';
    }

    ctx.fillStyle = '#001439';
    ctx.textAlign = "center";
    ctx.fillText(theName, 950, 930);

    ctx.font = '40px Roboto Mono';
    ctx.fillText(date, 350, 1200);
    ctx.fillText(certificateNumber, 1540, 1200);
    
    ctx.font = '80px Recursive';
    ctx.fillStyle = '#06446f';
    ctx.fillText(createDots(), 960, 25);

    ctx.fillStyle = '#E7C76C';
    ctx.font = '50px Recursive';
    ctx.fillText(totalTime, 930, 470);

    // Sponsor fonksiyonu bu işleri hallediyor. DU alltaki 4 satırı tekrar aktif ettim.
    
    document.getElementById("qc").style.display = "none";
    document.getElementById("loader").style.display = "block";

    let keyboard = new Audio("sound/keyboard.mp3");
    keyboard.play();

    // Tek sertifika ise...
    document.getElementById("creating-certificates-message").textContent = "SERTİFİKA OLUŞTURULUYOR...";
    const mainContainer = document.getElementById('main_container');
    if(screenWidth > 720){
        mainContainer.style.paddingTop = "5vw";
    }

    setTimeout(function() {

        document.getElementById("sertifika_img").src = canvas.toDataURL('image/png');
        document.getElementById("certificate-1").style.display = "block";

        // Sponsor fonksiyonu bu işi hallediyor. DU alltaki 4 satırı tekrar aktif ettim.
        document.getElementById("loader").style.display = "none";
        document.getElementById("certificateImageContainer").style.display = "flex";
        let created = new Audio("sound/created.mp3");
        created.play();
    }, 9500);
}

function drawSponsorImage(name, date, certificateNumber, onlySponsor = false) {

    theName = toNameCase(name);

    ctx2.drawImage(image2, 0, 0, canvas.width, canvas.height);
    ctx2.font = '100px Parisienne';
    ctx2.fillStyle = '#214F21';
    ctx2.textAlign = "center";
    ctx2.fillText(theName, 950, 980);

    ctx2.font = '40px Roboto Mono';
    ctx2.fillText(date, 350, 1250);
    ctx2.fillText(certificateNumber, 1552, 1250);

    document.getElementById("qc").style.display = "none";
    document.getElementById("loader").style.display = "block";

    let keyboard = new Audio("sound/keyboard.mp3");
    keyboard.play();
    
            
    if(onlySponsor){
        document.getElementById("creating-certificates-message").textContent = "SERTİFİKA OLUŞTURULUYOR...";
        const mainContainer = document.getElementById('main_container');
        if(screenWidth > 720){
            mainContainer.style.paddingTop = "5vw";
        }
    }

    setTimeout(function() {

        document.getElementById("komili_sertifika_img").src = canvas2.toDataURL('image/png');

        document.getElementById("loader").style.display = "none";
        
        if(onlySponsor){
            document.getElementById("certificateImageContainerInner").style.width = "700px";
            document.getElementById("download-btn").style.display = "none";
        }
        
        document.getElementById("certificateImageContainer").style.display = "flex";
        document.getElementById("certificate-2").style.display = "block";
        
        let created = new Audio("sound/created.mp3");
        created.play();
    }, 9500);
}

downloadBtn.addEventListener('click', function () {
    downloadBtn.href = canvas.toDataURL('image/png');
    downloadBtn.download = "sertifika-" + testerName + ".png";
});

downloadBtn2.addEventListener('click', function () {
    downloadBtn2.href = canvas2.toDataURL('image/png');
    downloadBtn2.download = "zeytin-" + testerName + ".png";
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
    increaseTried();
    playNow("failed");
    quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                <div class="result-inner">
                    Belirlenen süre içinde soruyu cevaplayamadınız. Bu yüzden test sona erdi.
                </div>
                </div><button class="green-gradient" onclick="location.reload()">Yeniden Dene</button>
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

function newSponsorCertificate(sponsor, add = false){
    let xhr = new XMLHttpRequest();
    let sponsorCertificateNumber = 0;
    if(add){
        xhr.open("GET", api + "/incr/success2");
    } else {
        xhr.open("GET", api + "/get/success2");
    }
    xhr.responseType = "json";
    xhr.onload = function() {
        console.log(sponsor + " sertifika sayısı: " + this.response.value)
        document.getElementById("sponsorCount").innerText = String(this.response.value);
    }
    xhr.send();  
}

function getHitNumber(add = false) {
    let xhr = new XMLHttpRequest();
    if(add){
        xhr.open("GET", api + "/incr/start");
    } else {
        xhr.open("GET", api + "/get/start");
    }
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById("hits").innerText = String(numberWithCommas(this.response.value));
        appendTotalCertificateNumber(this.response.value);
    }
    xhr.send();
}


function appendTotalCertificateNumber(hitNumber) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api + "/get/success");
    xhr.responseType = "json";
    xhr.onload = function() {
        document.getElementById("certificates").innerText = String(numberWithCommas(this.response.value));

        let percentage = (100 * this.response.value) / hitNumber;
        document.getElementById("success_percent").innerText = "%" + String(Math.floor(percentage));
        document.getElementById("success_rate").style.display = "block";
    }
    xhr.send();
}


function getCertificateNumber(name, onlySponsor = false) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api + "/incr/success");
    xhr.responseType = "json";
    xhr.onload = function() {
        let certificateNumber = String(this.response.value).padStart(8, "0");
        
        if(onlySponsor){
            drawSponsorImage(name, today, certificateNumber, true);
        } else {
            drawImage(name, today, certificateNumber, totalTime);
            //drawSponsorImage(name, today, certificateNumber);
        }
        
        getHitNumber();
        //newSponsorCertificate("komili", true);
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

// Komili projesi özelinde sorular karıştırılmayacak. TI iptal oldu.
shuffle(quizData);

const quiz = document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const prefix = document.getElementById('prefix')
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
    
    
    if(currentQuizData.prefix){
        prefix.innerText = currentQuizData.prefix;
    } else {
        prefix.innerText = "";
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

function KeyPress(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode === 75 && evtobj.ctrlKey) {
        newSponsorCertificate("komili");
        document.getElementById("sponsorCountContainer").style.display = "inline-block";
    }
}

document.onkeydown = KeyPress;

function playNow(sound) {
    let audio = document.getElementById(sound);
    audio.play();
}

function getName(onlySponsor = false) {
    let nameInput = document.getElementById("name");
    let nameValue = nameInput.value;
    testerName = nameInput.value;

    if(nameValue === "" || nameValue === undefined){
        nameInput.placeholder = "Buraya adınızı yazmalısınız";
        playNow("invalid");
    } else {
        if(onlySponsor){
            getCertificateNumber(nameValue, true)
        } else {
            getCertificateNumber(nameValue, false)
        }
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
                increaseTried();
                playNow("failed");
                quiz.innerHTML = `
                <div id="result">
                <h2>Maalesef...</h2>
                <div class="result-inner">
                    ${quizLimit} sorunun ${score} tanesini doğru cevapladınız.</br></br> Yeniden denemek ister misiniz?
                </div>
                </div>
                <div class="failed-buttons-container">
                <button class="try-again-button_IPTAL blue-gradient failed-screen-double-button_IPTAL" onclick="location.reload()">Yeniden Dene</button><button class="green-gradient failed-screen-double-button" style="display: none" onclick="getName(true)">Anıt Zeytin Ağacı Farkındalık Sertifikamı Oluştur</button>
                </div>
           `
            } else {
                let tada = new Audio("sound/tada.mp3");
                tada.play();
                quiz.innerHTML = `
                <div id="result">
                <h2>Tebrikler!</h2>
                <div class="result-inner">
                    <p>
                    ${quizLimit} sorunun tamamını doğru cevaplayarak Dahi Anlamındaki De Sertifikası kazandınız. 
                    </p>
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