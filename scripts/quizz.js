let questions = JSON.parse(localStorage.getItem("questions"));
let questionIndex = parseInt(localStorage.getItem("questionIndex") || "0")
let userAnswersIndexes = JSON.parse(localStorage.getItem("userAnswersIndexes")) || []


window.onload = function()
{
    const checkIcons = document.querySelectorAll('.wireframe_checkbox img.small_icon');
    checkIcons.forEach(icon => {
        icon.style.display = 'none';
    });

    const title = localStorage.getItem("question_set_path").split('.')[0].toUpperCase();
    $("#quizz-title").text(title);

    const timer_status = (localStorage.getItem("quiz_timer_is_on") || "false") === "true";
    if (timer_status === true) activateTimer();

    displayQuestion();

    $("#prev_question").off("click").on("click", function () {
        questionIndex--;
        displayQuestion();
    });
    $("#next_question").off("click").on("click", function () {
            questionIndex++;
            displayQuestion();
    });
    $("#submit_answers").off("click").on("click", function () {
            window.location.href = "overview.html";
    });
};


/**
 * activate the timer on the page
 */
function activateTimer() 
{
    console.log("activate timer");

    document.getElementById("timer").innerHTML = "loading...";
    document.getElementById("timer").hidden = false;

    var timespan = parseInt(localStorage.getItem("quiz_time_span")) * 60000 || 900000; // default 15 min
    var countdown = setInterval(
        function () {
            var minutes = Math.floor((timespan % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timespan % (1000 * 60)) / 1000);

            document.getElementById("timer").innerHTML = minutes + " m " + seconds + " s ";

            if (timespan < 0) {
                clearInterval(countdown);
                document.getElementById("timer").innerHTML = "EXPIRED";
                setTimeout(() => { window.location.href = "../overview/checked.html"; }, 2000);
            }
            timespan -= 1000;
        }, 
        1000
    );
}


function toggleCheck(answerDiv, questionIndex)
{
    const checkboxContainer = answerDiv.querySelector('.wireframe_checkbox');

    if (checkboxContainer.classList.contains('checked')) {
        checkboxContainer.classList.remove('checked');
    } else {
        checkboxContainer.classList.add('checked');
    }

    const checkIcon = checkboxContainer.querySelector('img.small_icon');
    if (checkIcon) {
        if (checkboxContainer.classList.contains('checked')) {
            checkIcon.style.display = 'block'; // Show the check icon
        } else {
            checkIcon.style.display = 'none'; // Hide the check icon
        }
    }

    if (questionIndex == null) return;

    console.log(questionIndex);
}

function displayQuestion() {
    if (questionIndex >= questions.length) {
        console.log("question out of bounds");
        return;
    }

    $("#progress").text(questionIndex + "/" + questions.length);

    const currentQuestion = questions[questionIndex];
    const questionNumber = `${questionIndex + 1}.`;
    const questionText = currentQuestion.text;

    let answersContainer = $('<div class="answers"></div>');
    currentQuestion.answers.forEach((answer, answerIndex) => {
        var isAnswerChecked = (userAnswersIndexes[questionIndex] && userAnswersIndexes[questionIndex].includes(answerIndex)) || false;

        var answerElement = $(`<div class="answer" onclick="toggleCheck(this, ${answerIndex})"></div>`).append(
            $('<div class="answer_text"></div>').html(answer),
            $('<div class="checkbox_container"></div>').append(
                $('<div class="wireframe_checkbox"></div>').append(
                    $('<img class="small_icon" src="../images/fa-solid--check.svg">').css('display', isAnswerChecked ? 'block' : 'none')
                ).addClass(isAnswerChecked ? "checked" : "")
            )
        )
        answersContainer.append(answerElement);
    });

    let quizzContainer = $('<div class="quizz"></div>').append(
        $('<div id="question_text"></div>').html(questionText),
        answersContainer
    );

    $("#card").html(
        $('<div id="question_number"></div>').html(questionNumber)
            .prop('outerHTML') + // Get the outer HTML of the first element
        quizzContainer.prop('outerHTML') + // Assuming quizzContainer is a jQuery object
        $('<img class="has_explanation_icon is_hidden" src="../images/question.svg">').prop('outerHTML')
    );

    if (questionIndex == 0) $("#prev_question").prop("disabled", true);
    else $("#prev_question").prop("disabled", false);

    if (questionIndex + 1 >= questions.length) {
        $("#next_question").prop("disabled", true);
        $("#submit_answers").prop("hidden", false); // Show
    } 
    else {
        $("#next_question").prop("disabled", false);
        $("#submit_answers").prop("hidden", true); // Hide
    }
}