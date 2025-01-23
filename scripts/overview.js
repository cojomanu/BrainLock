$(document).ready(function () {
    $("#cards").html(""); // clear the test HTML code

    var [correct, incorrect, unanswered] = displayQuestions();

    setupHeader(correct, incorrect, unanswered);
});


function setupHeader(correct, incorrect, unanswered) 
{
    var title = localStorage.getItem("question_set_path").split('.')[0].toUpperCase();
    $("#quizz-title").text(title)

    $("#correct_number_of_answers").text(correct);
    $("#incorrect_number_of_answers").text(incorrect);
    $("#unanswered_number_of_answers").text(unanswered);
}


/**
 * display the questions and answers
 */
function displayQuestions() {
    const questions = JSON.parse(localStorage.getItem("questions"));
    const user_answers_indexes = JSON.parse(localStorage.getItem('userAnswersIndexes')) || [];
    var nr_correct_answers = 0;
    var nr_incorrect_answers = 0;
    var nr_questions_not_answered = 0;

    questions.forEach((question, questionIndex) => {
        const questionNumber = `${questionIndex + 1}.`;
        const questionText = question.text;
        var isQuestionAnswered = false;
        var isQuestionAnsweredCorrectly = true;

        let answersContainer = $('<div class="answers"></div>');
        question.answers.forEach((answer, answerIndex) => {
            var isAnswerCorrect = question.correctAnswers.includes(answerIndex) || false;
            var isAnswerChecked = (user_answers_indexes[questionIndex] && user_answers_indexes[questionIndex].includes(answerIndex)) || false;

            var answerElement = $('<div class="answer"></div>').append(
                $('<div class="answer_text"></div>').html(answer),
                $('<div class="checkbox_container"></div>').append(
                    $('<img class="small_icon" src="../images/fa-solid--check.svg">').toggle(isAnswerChecked && isAnswerCorrect),
                    $('<img class="small_icon" src="../images/fluent-emoji-high-contrast--cross-mark.svg">').toggle(isAnswerChecked && !isAnswerCorrect)   
                )
                .addClass((isAnswerChecked && !isAnswerCorrect) ? "incorrect_answer" : "")
            )
            .addClass((isAnswerChecked && isAnswerCorrect) ? "correct_answer" : "")
            .addClass((!isAnswerChecked && isAnswerCorrect) ? "actual_answer" : "");
            answersContainer.append(answerElement);

            isQuestionAnswered = isQuestionAnswered || isAnswerChecked;
            isQuestionAnsweredCorrectly = isQuestionAnsweredCorrectly && isAnswerChecked && isAnswerCorrect;
        });

        const explanation = question.explanation || null;
        let explanationContainer = $("");
        if (explanation) {
            explanationContainer = $('<div class="explanation_container"></div>').append(
                $('<div class="horizontal_explanation_divider"></div>'),
                $('<div id="explanation"></div>').html(explanation)
            );
        }

        let quizzContainer = $('<div class="quizz"></div>').append(
            $('<div id="question_text"></div>').html(questionText),
            answersContainer,
            explanationContainer
        );

        let cardContainer = $('<div class="card"></div>').append(
            $('<div id="question_number"></div>').html(questionNumber),
            quizzContainer,
            $('<img class="has_explanation_icon" src="../images/question.svg"></div>').addClass(explanation ? "" : "is_hidden")
        );

        $("#cards").append(cardContainer);

        if (isQuestionAnswered && isQuestionAnsweredCorrectly) nr_correct_answers++;
        if (isQuestionAnswered && !isQuestionAnsweredCorrectly) nr_incorrect_answers++;
        if (!isQuestionAnswered) nr_questions_not_answered++;
    });

    return [nr_correct_answers, nr_incorrect_answers, nr_questions_not_answered];
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