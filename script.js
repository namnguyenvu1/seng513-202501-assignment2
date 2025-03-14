// This is the main JavaScript logic
import { Quiz } from './quiz.js';
import { User } from './user.js';
import { fetchQuestions } from './api.js';

let users = [];
let currentUser;
let quiz;

document.addEventListener("DOMContentLoaded", () => {
    showLoginForm();
});

function showLoginForm() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = `
        <h2>Welcome to Open Trivia Database</h2>
        <h2>Please Enter Your Name</h2>
        <input type="text" id="username" placeholder="Username">
        <button id="start-quiz">Start Quiz</button>
        <div id="error-message" style="color: red;"></div>
        <!-- <h3>Leaderboard</h3> -->
        <div id="score-history"></div>
    `;

    // document.getElementById("start-quiz").addEventListener("click", handleLogin);
    document.getElementById("start-quiz").addEventListener("click", handleLogin.bind(this)); // bind ensure when we call handleLogin, it can look at the right context, in this case the showLoginForm func
    updateScoreHistory();
}

function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function handleLogin() {
    try {
        const username = document.getElementById("username").value;
        if (!username.trim()) {
            document.getElementById("error-message").textContent = "Please enter a username!";
            return;
        }

        currentUser = new User(username);
        users.push(currentUser);

        document.getElementById("start-quiz").disabled = true;
        document.getElementById("start-quiz").textContent = "Loading questions...";

        let easyQuestions = [], mediumQuestions = [], hardQuestions = [];
        let allQuestions = [];

        try {
            allQuestions = await fetchQuestions();

            easyQuestions = allQuestions.filter(q => q.difficulty === 'easy').slice(0, 5);
            mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium').slice(0, 5);
            hardQuestions = allQuestions.filter(q => q.difficulty === 'hard').slice(0, 5);

            console.log("Easy Questions: ", easyQuestions.length);
            console.log("Medium Questions: ", mediumQuestions.length);
            console.log("Hard Questions: ", hardQuestions.length);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }

        quiz = new Quiz(easyQuestions, mediumQuestions, hardQuestions);
        showQuiz();
        displayQuestion();
    } catch (error) {
        console.error("Detailed error:", error);
        document.getElementById("error-message").textContent = "Error loading questions. Please try again.";
        document.getElementById("start-quiz").disabled = false;
        document.getElementById("start-quiz").textContent = "Start Quiz";
    }
}


function showQuiz() {
    document.getElementById("quiz-container").innerHTML = `
         <div id="question-container">
            <h1 id="quiz-title">Question ${quiz.questionCount}</h1>
            <p id="question-text"></p>
        </div>

        <div id="options-container">
            <div id="options"></div>
            <button id="submit-button">Submit</button>
            <button id="next-button" style="display:none;">Next</button>
        </div>

        <div id="score-display">
            <p>Current Player: ${currentUser.name}</p>
            <p>Score: ${currentUser.score}</p>
        </div>

        <div id="leaderboard-container">
            <div id="score-history"></div>
        </div>
    `;

    document.getElementById("submit-button").addEventListener("click", handleSubmit);
    document.getElementById("next-button").addEventListener("click", handleNext);
    updateScoreHistory();
}

function displayQuestion() {
    const questionData = quiz.getCurrentQuestion();
    if (!questionData) {
        endQuiz();
        return;
    }

    // Update the question number in the heading
    document.querySelector('h1').textContent = `Question ${quiz.questionCount}`;
    
    document.getElementById("question-text").textContent = questionData.text;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    questionData.choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.className = 'option-button';
        btn.onclick = function() {
            document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentUser.selectedAnswer = choice;
        }.bind(this);   //This ensures this inside the onclick handler refers to the correct object.
        optionsContainer.appendChild(btn);
    });
}

function handleSubmit() {
    if (!currentUser.selectedAnswer) {
        alert("Please select an answer before submitting.");
        return;
    }

    // Here, we store the correct answer instead of in the if statement, otherwise error might be caused
    const correctAnswer = quiz.getCurrentQuestion().correct;
    //const isCorrect = quiz.checkAnswer(currentUser.selectedAnswer, currentUser);
    // Explicitly sets `this` to `quiz` to ensure `checkAnswer` operates in the correct context
    const isCorrect = quiz.checkAnswer.call(quiz, currentUser.selectedAnswer, currentUser);
    const buttons = document.querySelectorAll('.option-button');

    buttons.forEach(btn => {
        if (btn.textContent === correctAnswer) { 
            btn.classList.add('correct');
        }
        btn.disabled = true;
    });

    document.getElementById("submit-button").style.display = "none";
    document.getElementById("next-button").style.display = "block";
    updateScoreDisplay()
    updateScoreHistory();
}

function updateScoreDisplay() {
    document.getElementById("score-display").innerHTML = `
        <p>Current Player: ${currentUser.name}</p>
        <p>Score: ${currentUser.score}</p>
    `;
}

function handleNext() {
    //quiz.nextQuestion();
    // Ensures `nextQuestion` is executed with `quiz` as `this`,
    // preventing potential issues where `this` may not refer to the correct object.
    quiz.nextQuestion.apply(quiz);
    document.getElementById("submit-button").style.display = "block";
    document.getElementById("next-button").style.display = "none";
    currentUser.selectedAnswer = null;
    displayQuestion();
}

function updateScoreHistory() {
    const history = document.getElementById("score-history");
    // Sort users by score in descending order
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);
    history.innerHTML = "<h3>Leaderboard</h3>" + 
        sortedUsers.map(user => `<p>${user.name}: ${user.score}</p>`).join("");
    
}
// function updateScoreHistory() {
//     const history = document.getElementById("score-history");
//     const sortedUsers = [...users].sort((a, b) => b.score - a.score);
    
//     history.innerHTML = "<h3>Leaderboard</h3>" + 
//         sortedUsers.map(function(user) {
//             return `<p>${user.name}: ${user.score}</p>`;
//         }).join("").call(this);
// }

function endQuiz() {
    document.getElementById("quiz-container").innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Final Score: ${currentUser.score}</p>
        <div id="score-history"></div>
        <button id="restart-quiz">Restart Quiz</button>
    `;
    updateScoreHistory();

    document.getElementById("restart-quiz").addEventListener("click", restartQuiz);
}

function restartQuiz() {
    // Reset the quiz and user state
    currentUser = null;
    quiz = null;
    showLoginForm();
}