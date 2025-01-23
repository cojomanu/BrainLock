$(document).ready(() => {
    $("#cards").html(""); // Clear existing HTML

    const [correct, incorrect, unanswered] = displayQuestions();
    setupHeader(correct, incorrect, unanswered);
});

function setupHeader(correct, incorrect, unanswered) {
    const title = localStorage.getItem("question_set_path").split('.')[0].toUpperCase();
    $("#quizz-title").text(title);

    $("#correct_number_of_answers").text(correct);
    $("#incorrect_number_of_answers").text(incorrect);
    $("#unanswered_number_of_answers").text(unanswered);
}

function displayQuestions() {
    const questions = JSON.parse(localStorage.getItem("questions"));
    const userAnswersIndexes = JSON.parse(localStorage.getItem('userAnswersIndexes')) || [];

    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let unansweredCount = 0;

    questions.forEach((question, index) => {
        const card = createQuestionCard(question, index, userAnswersIndexes);

        $("#cards").append(card);

        const isAnswered = isQuestionAnswered(question, userAnswersIndexes[index]);
        const isCorrect = isAnswered && isQuestionAnsweredCorrectly(question, userAnswersIndexes[index]);

        if (isAnswered && isCorrect) correctAnswersCount++;
        if (isAnswered && !isCorrect) incorrectAnswersCount++;
        if (!isAnswered) unansweredCount++;
    });

    return [correctAnswersCount, incorrectAnswersCount, unansweredCount];
}

function createQuestionCard(question, questionIndex, userAnswersIndexes) {
    const questionNumber = `${questionIndex + 1}.`;
    const answersContainer = createAnswersContainer(question, userAnswersIndexes[questionIndex]);
    const explanationContainer = createExplanationContainer(question.explanation);

    const quizzContainer = $('<div class="quizz"></div>').append(
        $('<div id="question_text"></div>').html(question.text),
        answersContainer,
        explanationContainer
    );

    return $('<div class="card"></div>').append(
        $('<div id="question_number"></div>').html(questionNumber),
        quizzContainer,
        $('<img class="has_explanation_icon" src="../images/question.svg"></img>')
            .toggleClass("is_hidden", !question.explanation)
    );
}

function createAnswersContainer(question, userAnswers) {
    const container = $('<div class="answers"></div>');

    question.answers.forEach((answer, answerIndex) => {
        const isCorrect = question.correctAnswers.includes(answerIndex);
        const isChecked = userAnswers?.includes(answerIndex);

        const answerElement = $('<div class="answer"></div>')
            .addClass(isChecked && isCorrect ? "correct_answer" : "")
            .addClass(isChecked && !isCorrect ? "incorrect_answer" : "")
            .addClass(!isChecked && isCorrect ? "actual_answer" : "")
            .append(
                $('<div class="answer_text"></div>').html(answer),
                $('<div class="checkbox_container"></div>').append(
                    $('<img class="small_icon" src="../images/fa-solid--check.svg">').toggle(isChecked && isCorrect),
                    $('<img class="small_icon" src="../images/fluent-emoji-high-contrast--cross-mark.svg">').toggle(isChecked && !isCorrect)
                )
            );

        container.append(answerElement);
    });

    return container;
}

function createExplanationContainer(explanation) {
    if (!explanation) return $('<div></div>');

    return $('<div class="explanation_container"></div>').append(
        $('<div class="horizontal_explanation_divider"></div>'),
        $('<div id="explanation"></div>').html(explanation)
    );
}

function isQuestionAnswered(question, userAnswers) {
    return !!userAnswers?.length;
}

function isQuestionAnsweredCorrectly(question, userAnswers) {
    return userAnswers?.every(answerIndex => question.correctAnswers.includes(answerIndex));
}