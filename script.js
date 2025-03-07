// This is the main JavaScript logic
import { Quiz } from './quiz.js';
import { User } from './user.js';
import { fetchQuestions } from './api.js';
import { questionGenerator } from './generator.js';

const user = new User("Guest");
let quiz;

document.addEventListener("DOMContentLoaded", async () => {
    const questions = await fetchQuestions();
    quiz = new Quiz(questions);
    displayQuestion();
});

function displayQuestion() {
    const questionData = quiz.getCurrentQuestion();
    if (!questionData) {
        document.getElementById("quiz-container").innerHTML = `<h2>Quiz Over! Your score is: ${user.score}</h2>`;
        return;
    }
    
    document.getElementById("question-text").textContent = questionData.text;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    questionData.choices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = function() {
            quiz.checkAnswer(choice, user);
            displayQuestion();
        };
        optionsContainer.appendChild(btn);
    });
}
