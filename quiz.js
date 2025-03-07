// This is the Quiz class 
import { questionGenerator } from './generator.js';

export class Quiz {
    constructor(questions) {
        this.questions = questions.map(q => ({
            text: q.question,
            choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct: q.correct_answer
        }));
        this.questionGen = questionGenerator(this.questions);
        this.currentQuestion = this.questionGen.next().value;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    checkAnswer(answer, user) {
        if (answer === this.currentQuestion.correct) {
            user.updateScore();
        }
        this.currentQuestion = this.questionGen.next().value;
    }
}
