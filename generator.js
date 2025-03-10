// This is the generator funciton for dynamic questions
// Use yield to return question once at a time
// More efficient than generate all question at once
export function* questionGenerator(questions) {
    for (const question of questions) {
        yield question;
    }
}
