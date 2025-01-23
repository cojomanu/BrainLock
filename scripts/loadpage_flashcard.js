$(document).ready(function () {
    initializeFlashcards();
});

function initializeFlashcards() {
    showLoadingIndicator();

    clearLocalStorage();

    const questionSetPath = localStorage.getItem("flashcard_question_set_path");
    const isTimerEnabled = localStorage.getItem("flashcard_timer_is_on") === "true";
    const timeSpan = parseInt(localStorage.getItem("flashcard_time_span"), 10) || 15;
    const showAllQuestions = localStorage.getItem("flashcard_show_all") === "true";
    const numberOfQuestions = parseInt(localStorage.getItem("flashcard_number"), 10) || 20;
    const randomizeQuestions = localStorage.getItem("flashcard_randomize") === "true";

    const questionSetPathWithBase = `../assets/flashcards/${questionSetPath}`;

    if (showAllQuestions) {
        fetchQuestions(questionSetPathWithBase, "all", randomizeQuestions, handleQuestions);
    } else {
        fetchQuestions(questionSetPathWithBase, numberOfQuestions, randomizeQuestions, handleQuestions);
    }
}

function showLoadingIndicator() {
    $("#loading").show();
}

function clearLocalStorage() {
    localStorage.removeItem("flashcards_data");
    localStorage.removeItem("flashcards_question_index");
}

function fetchQuestions(path, limit, randomize, callback) {
    // Assuming `getQuestions` is defined elsewhere in your codebase
    getQuestions(path, limit, randomize, callback);
}

function handleQuestions(questions) {
    if (!questions) {
        console.error("Questions array is null");
        return;
    }

    saveQuestionsToLocalStorage(questions);
    hideLoadingIndicator();
    redirectToFlashcardPage();
}

function saveQuestionsToLocalStorage(questions) {
    localStorage.setItem("flashcards_data", JSON.stringify(questions));
}

function hideLoadingIndicator() {
    $("#loading").hide();
}

function redirectToFlashcardPage() {
    window.location.href = "flashcard.html";
}
