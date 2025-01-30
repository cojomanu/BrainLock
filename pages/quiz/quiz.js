let questions = JSON.parse(localStorage.getItem("questions"));
let questionIndex = parseInt(localStorage.getItem("questionIndex") || "0")
let userAnswersIndexes = JSON.parse(localStorage.getItem("userAnswersIndexes")) || []


$(document).ready(function () {
    var title = localStorage.getItem("question_set_path").split('.')[0].toUpperCase();
    $("#quizz-title").text(title);

    const timer_status = (localStorage.getItem("quiz_timer_is_on") || "false") === "true";
    if (timer_status === true) {
        activateTimer();
    }

    displayQuestion();

    $("#prev_question").on("click", function () {
        questionIndex--;
        displayQuestion();
    });
});


function toggleFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
    else if (document.fullscreenElement) document.exitFullscreen();
}


function displayQuestion() {
    if (questionIndex >= questions.length) {
        console.log("question out of bounds");
        return;
    }

    $("#progress").text(questionIndex + "/" + questions.length);

    let currentQuestion = questions[questionIndex];
    let question = `${questionIndex + 1}. ${currentQuestion.text}`
    if ("images" in currentQuestion) {
        currentQuestion.images.forEach(element => {
            question = `${question}\n${element}`       
        });
    }
    $("#question_text").html(question);
    $("#answers").html("");
    

    currentQuestion.answers.forEach((answer, i) => {
        const isSelected = userAnswersIndexes[questionIndex] && userAnswersIndexes[questionIndex].includes(i) ? "checked" : "";
        $("#answers").append(
            `<div class="answer">${answer} <input type="checkbox" data-index="${i}" ${isSelected}></div>`
        );
    });


    $('#answers input[type="checkbox"]').on("change", function () {
        const answerIndex = $(this).data("index");
        userAnswersIndexes[questionIndex] = userAnswersIndexes[questionIndex] || [];

        if (this.checked) {
            if (!userAnswersIndexes[questionIndex].includes(answerIndex)) {
                userAnswersIndexes[questionIndex].push(answerIndex);
            }
        } else {
            userAnswersIndexes[questionIndex] = userAnswersIndexes[questionIndex].filter(idx => idx !== answerIndex);
        }

        userAnswersIndexes = userAnswersIndexes.map(arr => arr.sort((a, b) => a - b));
        localStorage.setItem('userAnswersIndexes', JSON.stringify(userAnswersIndexes));
    });


    if (questionIndex + 1 >= questions.length) {
        $("#next_question").text("SEND");
        $("#next_question").off("click").on("click", function () {
            window.location.href = "../overview/checked.html";
        });
    } else {
        $("#next_question").text("NEXT");
        $("#next_question").off("click").on("click", function () {
            questionIndex++;
            displayQuestion();
        });
    }

    if (questionIndex == 0) {
        $("#prev_question").hide();
    } else {
        $("#prev_question").show();
    }
}


/**
 * activate the timer on the page
 */
function activateTimer() {
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


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        // Simulate a click on the 'Prev' button when the left arrow key is pressed
        document.getElementById("prev_question").click();
    } else if (event.key === "ArrowRight") {
        // Simulate a click on the 'Next' button when the right arrow key is pressed
        document.getElementById("next_question").click();
    }
});
