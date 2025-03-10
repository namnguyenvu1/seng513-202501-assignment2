// This is the Quiz class 
import { questionGenerator } from './generator.js';

// To fix the &quot; problem
function decodeHtmlEntities(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

export class Quiz {
    constructor(easyQuestions, hardQuestions) {
        this.easyQuestions = this.formatQuestions(easyQuestions);
        this.hardQuestions = this.formatQuestions(hardQuestions);
        this.currentDifficulty = 'easy';
        this.usedQuestions = new Set();
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.getNextAvailableQuestion();
    }

    // Old school
    // formatQuestions(questions) {
    //     return questions.map(q => ({
    //         text: q.question,
    //         choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
    //         correct: q.correct_answer
    //     }));
    // }

    // New school
    formatQuestions(questions) {
        return questions.map(q => ({
            text: decodeHtmlEntities(q.question),
            choices: [
                ...q.incorrect_answers.map(decodeHtmlEntities.bind(this)),  // Using bind
                decodeHtmlEntities.call(this, q.correct_answer) // Using call
            ].sort(() => Math.random() - 0.5),
            correct: decodeHtmlEntities.apply(this, [q.correct_answer]) // Using apply
        }));
    }

    getNextAvailableQuestion() {
        // If we've used all questions from both difficulties, return null
        if (this.usedQuestions.size >= this.easyQuestions.length + this.hardQuestions.length) {
            return null;
        }

        const questions = this.currentDifficulty === 'easy' ? this.easyQuestions : this.hardQuestions;
        
        // Find the first unused question in the current difficulty
        const availableQuestion = questions.find(q => !this.usedQuestions.has(q.text));

        if (availableQuestion) {
            this.usedQuestions.add(availableQuestion.text);
            return availableQuestion;
        }

        // If no questions available in current difficulty, switch difficulty and try again
        this.currentDifficulty = this.currentDifficulty === 'easy' ? 'hard' : 'easy';
        return this.getNextAvailableQuestion();
    }

    checkAnswer(answer, user) {
        const isCorrect = answer === this.currentQuestion.correct;
        if (isCorrect) {
            user.updateScore();
            this.currentDifficulty = 'hard';
        } else {
            this.currentDifficulty = 'easy';
        }
        
        // Always get next question after an answer, regardless of correct/incorrect
        this.nextQuestion();
        return isCorrect;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    nextQuestion() {
        this.currentQuestion = this.getNextAvailableQuestion();
        return this.currentQuestion !== null;
    }
}