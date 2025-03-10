import { questionGenerator } from './generator.js';

// To fix the &quot; problem by create text area and set text inside
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

        // Create generator instance for questions
        this.questionIterator = questionGenerator([...this.easyQuestions, ...this.hardQuestions]);

        // Get the first question
        this.currentQuestion = this.questionIterator.next().value;
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
            this.currentDifficulty = 'hard';
        } else {
            this.currentDifficulty = 'easy';
        }

        return this.nextQuestion(), isCorrect;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    nextQuestion() {
        const next = this.questionIterator.next();
        this.currentQuestion = next.done ? null : next.value;
        return !next.done;
    }
}
