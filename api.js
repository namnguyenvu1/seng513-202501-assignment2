// This file will handle fetching questions asynchronously from the website on the ass description
export async function fetchQuestions(difficulty = 'easy') {
    // 5 question for now, alter if you guys need
    const url = `https://opentdb.com/api.php?amount=5&type=multiple&difficulty=${difficulty}`; 
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}
