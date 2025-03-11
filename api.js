// This file will handle fetching questions asynchronously from the website on the ass description
export async function fetchQuestions() {
    const url = `https://opentdb.com/api.php?amount=100&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}
