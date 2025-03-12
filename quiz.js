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
        // this.questionIterator = questionGenerator([...this.easyQuestions, ...this.easyQuestions, ...this.hardQuestions]);

        // Question count limit
        this.questionCount = 1;
        this.maxQuestions = 5;

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
            // // Always go back to easy on wrong answer
            // this.currentDifficulty = 'easy';
            // Decrease difficulties
            if (this.currentDifficulty === 'hard') {
                this.currentDifficulty = 'medium';
            } else if (this.currentDifficulty === 'medium') {
                this.currentDifficulty = 'easy';
            }
        }

        return isCorrect;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    nextQuestion() {
        console.log(this.questionCount);
        // console.log(this.currentDifficulty);
        console.log(`This Question Difficulty: ${this.currentDifficulty}`);
        // End the quiz after the max number of questions
        if (this.questionCount >= this.maxQuestions) {
            console.log('Quiz completed!');
            this.currentQuestion = null;
            return false;
        }

        let next;

        // Pick the next question based on difficulty
        if (this.currentDifficulty === 'easy') {
            next = this.easyIterator.next();
        } else if (this.currentDifficulty === 'medium') {
            next = this.mediumIterator.next();
        } else if (this.currentDifficulty === 'hard') {
            next = this.hardIterator.next();
        }

        // // Debugging information
        // console.log(`Current Difficulty: ${this.currentDifficulty}`);
        // console.log(`Next Question Done: ${next.done}`);

        // Print the difficulty of the next question
        console.log(`Next Question Difficulty: ${this.currentDifficulty}`);

        // If no more questions are left or max questions reached, return null
        this.currentQuestion = next.done ? null : next.value;

        // Increment the question counter
        this.questionCount++;

        return !next.done;
    }
}