let user_answers_indexes = JSON.parse(localStorage.getItem('userAnswersIndexes')) || [];
let questions = JSON.parse(localStorage.getItem("questions"));


/**
 * on document load
 */
$(document).ready(function () {
    var title = localStorage.getItem("question_set_path").split('.')[0].toUpperCase();
    $("#quizz-title").text(title);

    $("#text").html("")
    
    displayQuestions();

    $("#new_quiz").on("click", function () {
        window.location.href = "../quiz/quizmaster.html";
    });
});


/**
 * display the questions and answers
 */
function displayQuestions() {
    let nr_correct_answers = 0;
    let nr_incorrect_answers = 0;
    let nr_questions_not_answered = 0;

    questions.forEach((question, questionIndex) => {
        let answered = false;
        let all_correct = true;
        let partially_answered = false;
        let wrong = false;

        var question_text = `${questionIndex + 1}. ${question.text}`
        if ("images" in question) {
            question.images.forEach(element => {
                question_text = `${question_text}\n${element}`       
            });
        }

        const quizzContainer = $('<div class="quizz"></div>').html(question_text);

        question.answers.forEach((answer, answerIndex) => {
            let answerElement = $('<div class="answers"></div>').html(answer);

            if (user_answers_indexes[questionIndex] && user_answers_indexes[questionIndex].includes(answerIndex)) {
                answered = true;

                if (question.correctAnswers.includes(answerIndex)) {
                    answerElement.addClass('correct-answer');
                }
                else {
                    answerElement.addClass('incorrect-answer');
                    all_correct = false;
                    wrong = true;
                }
            }
            else {
                if (question.correctAnswers.includes(answerIndex)) {
                    answerElement.addClass('missed-correct-answer');
                    all_correct = false;
                    partially_answered = true;
                }
            }

            quizzContainer.append(answerElement);
        });

        const questionContainer = $('<div class="question-container"></div>');

        const explanation = question.explanation || null;
        if (explanation) {
            const svg_image = $('<img src="../../images/question.svg" class="svg" onclick="toggleExplanation(this)"/>');
            const quizzExplanation = $('<div class="explanation"></div>').html(explanation);
            questionContainer.addClass("has-explanation");
            questionContainer.append(svg_image, quizzContainer, quizzExplanation);
        }
        else {
            questionContainer.html(quizzContainer);
        }

        $("#text").append(questionContainer);

        if (!answered) {
            nr_questions_not_answered++;
        }
        else if (all_correct) {
            nr_correct_answers++;
        }
        else if (wrong || partially_answered) {
            nr_incorrect_answers++;
        }
    });

    injectQuizzStats(nr_correct_answers, nr_incorrect_answers, nr_questions_not_answered);
}


function toggleExplanation(img) {
    // Get the parent container of the clicked image
    var parent = img.closest('.question-container');
    
    // Get the quizz and explanation elements inside this container
    var quizz = parent.querySelector('.quizz');
    var explanation = parent.querySelector('.explanation');
    
    // Toggle the hidden attribute of quizz and explanation
    if (quizz.hidden) {
        quizz.hidden = false;
        explanation.hidden = true;
    } else {
        quizz.hidden = true;
        explanation.hidden = false;
    }
}


/**
 * injects the stats of the quizz
 * @param {*} nr_correct_answers 
 * @param {*} nr_incorrect_answers 
 * @param {*} nr_answers_not_answerd 
 */
function injectQuizzStats(nr_correct_answers, nr_incorrect_answers, nr_questions_not_answered) {
    const score_element = $('<div class="score"></div>');
    score_element.html(
        '<span style="color: #d4f7d4;">Nr întrebări corecte: ' + nr_correct_answers + '</span><br>' +
        '<span style="color: #f7d4d4;">Nr de întrebări greșite: ' + nr_incorrect_answers + '</span><br>' +
        '<span style="color: #8ad2ff;">Nr de întrebări fără răspuns: ' + nr_questions_not_answered + '</span>'
    );
    $('#score').append(score_element);
    
    console.log("Numărul de întrebări corecte:", nr_correct_answers);
    console.log("Numărul de întrebări greșite:", nr_incorrect_answers);
    console.log("Numărul de întrebări fără răspuns:", nr_questions_not_answered);
}