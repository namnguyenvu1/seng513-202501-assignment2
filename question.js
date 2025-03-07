// This is the question class
export class Question {
    constructor(text, choices, correct) {
        this.text = text;
        this.choices = choices;
        this.correct = correct;
    }

    isCorrect(answer) {
        return answer === this.correct;
    }
}
