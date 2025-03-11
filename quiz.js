import { questionGenerator } from './generator.js';

function decodeHtmlEntities(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

export class Quiz {
    constructor(easyQuestions, mediumQuestions, hardQuestions) {
        this.easyQuestions = this.formatQuestions(easyQuestions);
        this.mediumQuestions = this.formatQuestions(mediumQuestions);
        this.hardQuestions = this.formatQuestions(hardQuestions);
        this.currentDifficulty = 'easy';

        // Create separate generators for each difficulty
        this.easyIterator = questionGenerator(this.easyQuestions);
        this.mediumIterator = questionGenerator(this.mediumQuestions);
        this.hardIterator = questionGenerator(this.hardQuestions);

        // Start with an easy question
        this.currentQuestion = this.easyIterator.next().value;
    }

    formatQuestions(questions) {
        return questions.map(q => ({
            text: decodeHtmlEntities(q.question),
            choices: [
                ...q.incorrect_answers.map(decodeHtmlEntities), 
                decodeHtmlEntities(q.correct_answer)
            ].sort(() => Math.random() - 0.5),
            correct: decodeHtmlEntities(q.correct_answer)
        }));
    }

    checkAnswer(answer, user) {
        const isCorrect = answer === this.currentQuestion.correct;

        if (isCorrect) {
            user.updateScore();
            // Increase difficulty
            if (this.currentDifficulty === 'easy') {
                this.currentDifficulty = 'medium';
            } else if (this.currentDifficulty === 'medium') {
                this.currentDifficulty = 'hard';
            }
        } else {
            // Always go back to easy on wrong answer
            this.currentDifficulty = 'easy';
        }

        return this.nextQuestion(), isCorrect;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    nextQuestion() {
        let next;
        
        // Pick the next question based on difficulty
        if (this.currentDifficulty === 'easy') {
            next = this.easyIterator.next();
        } else if (this.currentDifficulty === 'medium') {
            next = this.mediumIterator.next();
        } else if (this.currentDifficulty === 'hard') {
            next = this.hardIterator.next();
        }

        // If no more questions are left, return null
        this.currentQuestion = next.done ? null : next.value;
        return !next.done;
    }
}
