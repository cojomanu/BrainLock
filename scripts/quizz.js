let questions = JSON.parse(localStorage.getItem("questions"));
let questionIndex = parseInt(localStorage.getItem("questionIndex") || "0");
let userAnswersIndexes = JSON.parse(localStorage.getItem("userAnswersIndexes")) || [];

window.onload = function () {
    initializePage();
};

function initializePage() {
    hideCheckIcons();
    setQuizTitle();
    handleTimer();
    displayQuestion();
    initializeEventHandlers();
}

function hideCheckIcons() {
    document.querySelectorAll('.wireframe_checkbox img.small_icon').forEach(icon => {
        icon.style.display = 'none';
    });
}

function setQuizTitle() {
    const title = localStorage.getItem("question_set_path")?.split('.')[0]?.toUpperCase() || "QUIZ";
    $("#quizz-title").text(title);
}

function handleTimer() {
    const timerIsOn = (localStorage.getItem("quiz_timer_is_on") || "false") === "true";
    if (timerIsOn) activateTimer();
}

function activateTimer() {
    console.log("activate timer");

    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "loading...";
    timerElement.hidden = false;

    let timespan = parseInt(localStorage.getItem("quiz_time_span")) * 60000 || 900000; // default 15 min

    const countdown = setInterval(() => {
        if (timespan < 0) {
            clearInterval(countdown);
            timerElement.innerHTML = "EXPIRED";
            setTimeout(() => {
                window.location.href = "../overview/checked.html";
            }, 2000);
            return;
        }

        const minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timespan % (1000 * 60)) / 1000);
        timerElement.innerHTML = `${minutes} m ${seconds} s`;

        timespan -= 1000;
    }, 1000);
}

function initializeEventHandlers() {
    $("#prev_question").off("click").on("click", () => navigateQuestion(-1));
    $("#next_question").off("click").on("click", () => navigateQuestion(1));
    $("#submit_answers").off("click").on("click", () => {
        window.location.href = "overview.html";
    });
}

function navigateQuestion(direction) {
    questionIndex += direction;
    displayQuestion();
}

function saveSelection() {
    localStorage.setItem("userAnswersIndexes", JSON.stringify(userAnswersIndexes));
}

function toggleCheck(answerDiv, answerIndex) {
    const checkboxContainer = answerDiv.querySelector('.wireframe_checkbox');
    const checkIcon = checkboxContainer.querySelector('img.small_icon');

    checkboxContainer.classList.toggle('checked');
    checkIcon.style.display = checkboxContainer.classList.contains('checked') ? 'block' : 'none';

    if (!userAnswersIndexes[questionIndex]) {
        userAnswersIndexes[questionIndex] = [];
    }

    if (checkboxContainer.classList.contains('checked')) {
        userAnswersIndexes[questionIndex].push(answerIndex);
    } else {
        userAnswersIndexes[questionIndex] = userAnswersIndexes[questionIndex].filter(index => index !== answerIndex);
    }

    saveSelection();
}

function displayQuestion() {
    if (!questions || questionIndex >= questions.length || questionIndex < 0) {
        console.error("Question index out of bounds.");
        return;
    }

    const currentQuestion = questions[questionIndex];
    const answersContainer = createAnswersContainer(currentQuestion);

    $("#progress").text(`${questionIndex + 1}/${questions.length}`);
    $("#card").html(createQuestionCard(currentQuestion, answersContainer));

    updateNavigationButtons();
}

function createAnswersContainer(question) {
    const answersContainer = $('<div class="answers"></div>');

    question.answers.forEach((answer, answerIndex) => {
        const isAnswerChecked = userAnswersIndexes[questionIndex]?.includes(answerIndex) || false;

        const answerElement = $(
            `<div class="answer" onclick="toggleCheck(this, ${answerIndex})"></div>`
        ).append(
            $('<div class="answer_text"></div>').html(answer),
            $('<div class="checkbox_container"></div>').append(
                $('<div class="wireframe_checkbox"></div>').append(
                    $('<img class="small_icon" src="../assets/images/fa-solid--check.svg">')
                        .css('display', isAnswerChecked ? 'block' : 'none')
                ).addClass(isAnswerChecked ? "checked" : "")
            )
        );

        answersContainer.append(answerElement);
    });

    return answersContainer;
}

function createQuestionCard(question, answersContainer) {
    const questionNumber = `<div id="question_number">${questionIndex + 1}.</div>`;
    const questionText = `<div id="question_text">${question.text}</div>`;
    const explanationIcon = '<img class="has_explanation_icon is_hidden" src="../assets/images/question.svg">';

    return questionNumber + $('<div class="quizz"></div>').append(
        questionText,
        answersContainer
    ).prop('outerHTML') + explanationIcon;
}

function updateNavigationButtons() {
    $("#prev_question").prop("disabled", questionIndex === 0);
    $("#next_question").prop("disabled", questionIndex + 1 >= questions.length);
    $("#submit_answers").prop("hidden", questionIndex + 1 < questions.length);
}
