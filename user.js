// This is the User class
export class User {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    updateScore() {
        this.score++;
    }
}
