$(document).ready(function () {
    $("#loading").show();

    localStorage.removeItem("questions");
    localStorage.removeItem("userAnswersIndexes");

    const question_set_path = localStorage.getItem("question_set_path");
    const quizTimerIsOn = localStorage.getItem("quiz_timer_is_on") || "false";
    const quizTimeSpan = parseInt(localStorage.getItem("quiz_time_span")) || 15;
    const quizShowAll = localStorage.getItem("quiz_show_all") || "false";
    const quizNumber = parseInt(localStorage.getItem("quiz_number")) || 20;

    if (question_set_path.endsWith(".xml")) {
        if (quizShowAll === "true")
            getQuestionsFromXML('../../assets/quizzes/' + question_set_path, "all", gotQuestions);
        else
            getQuestionsFromXML('../../assets/quizzes/' + question_set_path, quizNumber, gotQuestions);
    }
    else {
        if (quizShowAll === "true")
            getQuestions('../../assets/quizzes/' + question_set_path, "all", gotQuestions);
        else
            getQuestions('../../assets/quizzes/' + question_set_path, quizNumber, gotQuestions);
    }
});


function gotQuestions(questions) {
    if (questions == null) {
        console.log("questions array is null");
    }

    localStorage.setItem("questions", JSON.stringify(questions));
    $("#loading").hide();
    navigateToNextPage();
}


function navigateToNextPage() {
    const isPreview = (localStorage.getItem("preview") || "false") === "true";

    if (isPreview) window.location.href = "../overview.html";
    else window.location.href = "../quizz.html";
}