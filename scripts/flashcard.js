let questions = JSON.parse(localStorage.getItem("flashcards_data"));
let flashcardQuestionIndex = parseInt(localStorage.getItem("flashcards_question_index") || "0")
let loaded = 0;
let question = false;


$(document).ready(function () {
    loadQuestion()

    var title = localStorage.getItem("flashcard_question_set_path").split('.')[0].toUpperCase();
    $("#flashcard-title").text(title);

    $("#prev_question").off("click").on("click", function () {
        flashcardQuestionIndex--;
        loadQuestion();
    });
    $("#next_question").off("click").on("click", function () {
        if ($("#next_question").text() == "NEXT") {
            flashcardQuestionIndex++;
            loadQuestion();
        }
        else if ($("#next_question").text() == "HOME") {
            window.location.href = "../pages/home.html";
        }
    });
});


function toggleFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
    else if (document.fullscreenElement) document.exitFullscreen();
}


function loadQuestion() {
    const card = document.getElementById("card");

    if (questions == null) {
        console.log("question null");
        return;
    }
    if (card == null) {
        console.log("could not find card");
        return;
    }

    localStorage.setItem("flashcards_question_index", flashcardQuestionIndex)
    card.innerHTML = questions[flashcardQuestionIndex].question;
    card.classList = "question"
    question = true;
    $("#progress").text(flashcardQuestionIndex + "/" + questions.length);

    if (flashcardQuestionIndex == 0) $("#prev_question").prop("disabled", true);
    else $("#prev_question").prop("disabled", false);

    if (flashcardQuestionIndex + 1 >= questions.length) $("#next_question").text("HOME");
    else $("#next_question").text("NEXT");

    return;
}


function loadAnswer() {
    const card = document.getElementById("card");

    if (questions == null) {
        console.log("question null");
        return;
    }
    if (card == null) {
        console.log("could not find card");
        return;
    }

    card.innerHTML = questions[flashcardQuestionIndex].answer;
    card.classList = "answer"
    question = false;
    return;
}


function flipCard() {
    if (!question) loadQuestion();
    else loadAnswer();
    return;
}