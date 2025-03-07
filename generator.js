// This is the generator funciton for dynamic questions
export function* questionGenerator(questions) {
    for (const question of questions) {
        yield question;
    }
}
