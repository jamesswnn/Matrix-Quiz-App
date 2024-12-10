const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

console.log("JavaScript file loaded.");

fetch('questions.json')
    .then((res) => {
        if (!res.ok) {
             throw new Error('HTTP error! Status: ${res.status}');
        }
        return res.json();
    })
    .then((loadedQuestions) => {
        console.log('Questions loaded:', loadedQuestions);
        questions = loadedQuestions;
        
        startGame();
    })
    .catch((err) => {
        console.error('Error loading questions.json:', err);
        loader.innerText = 'Failed to load questions. Please try again later.';
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    console.log('Starting game...');
    questionCounter = 0;
    score = 0;
    availableQuestion = [...questions];
    console.log('Questions available:', availableQuestion);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    console.log('Loader hidden, game shown');
};

getNewQuestion = () => {
    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length);
    currentQuestion = availableQuestion[questionIndex];
    availableQuestion.splice(questionIndex, 1);

     // แสดงข้อความคำถาม
     question.innerText = currentQuestion.question;

     // แสดงรูปภาพคำถาม (ถ้ามี)
    const questionImage = document.getElementById('questionImage');
    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

     // แสดงตัวเลือก
    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        const choiceData = currentQuestion['choice' + number];

        // ล้างตัวเลือกก่อน (ป้องกันการซ้อนซ้อนของข้อความหรือภาพใน DOM)
        choice.innerHTML = '';
        
         // กรณีมีข้อความ
        if (choiceData.text) {
            const textElement = document.createElement('span');
            textElement.innerText = choiceData.text;
            textElement.style.marginRight = '10px'; // เพิ่มช่องว่างระหว่างข้อความและรูป
            choice.appendChild(textElement);
        }

        // กรณีมีรูปภาพ
        if (choiceData.image) {
            const imgElement = document.createElement('img');
            imgElement.src = choiceData.image;
            imgElement.alt = `Choice ${number}`;
            imgElement.style.maxWidth = '110px'; // ปรับขนาดภาพใหญ่ขึ้น
            imgElement.style.maxHeight = '110px'; // เพิ่มข้อจำกัดความสูง
            imgElement.style.cursor = 'pointer'; // ให้ชัดเจนว่าคลิกได้
            choice.appendChild(imgElement);
        }

    });

    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target.closest('.choice-text'); // ตรวจจับ parent ของ text หรือ image
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
