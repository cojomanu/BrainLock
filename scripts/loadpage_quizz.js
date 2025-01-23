$(document).ready(function () {
    initializePage();
});

function initializePage() {
    showLoading();
    clearLocalStorage();

    const questionSetPath = localStorage.getItem("question_set_path");
    const quizSettings = getQuizSettings();

    if (questionSetPath) {
        loadQuestions(questionSetPath, quizSettings);
    } else {
        console.error("No question set path found in localStorage.");
    }
}

function showLoading() {
    $("#loading").show();
}

function hideLoading() {
    $("#loading").hide();
}

function clearLocalStorage() {
    localStorage.removeItem("questions");
    localStorage.removeItem("userAnswersIndexes");
}

function getQuizSettings() {
    return {
        timerIsOn: localStorage.getItem("quiz_timer_is_on") || "false",
        timeSpan: parseInt(localStorage.getItem("quiz_time_span")) || 15,
        showAll: localStorage.getItem("quiz_show_all") || "false",
        numberOfQuestions: parseInt(localStorage.getItem("quiz_number")) || 20
    };
}

function loadQuestions(questionSetPath, quizSettings) {
    const fullPath = `../assets/quizzes/${questionSetPath}`;

    if (questionSetPath.endsWith(".xml")) {
        fetchQuestionsFromXML(fullPath, quizSettings, gotQuestions);
    } else {
        fetchQuestions(fullPath, quizSettings, gotQuestions);
    }
}

function fetchQuestionsFromXML(path, settings, callback) {
    const fetchMode = settings.showAll === "true" ? "all" : settings.numberOfQuestions;
    getQuestionsFromXML(path, fetchMode, callback);
}

function fetchQuestions(path, settings, callback) {
    const fetchMode = settings.showAll === "true" ? "all" : settings.numberOfQuestions;
    getQuestions(path, fetchMode, callback);
}

function gotQuestions(questions) {
    if (!questions) {
        console.error("Questions array is null");
        return;
    }

    localStorage.setItem("questions", JSON.stringify(questions));
    hideLoading();
    navigateToNextPage();
}

function navigateToNextPage() {
    const isPreview = (localStorage.getItem("preview") || "false") === "true";
    const nextPage = isPreview ? "overview.html" : "quizz.html";
    window.location.href = nextPage;
}
