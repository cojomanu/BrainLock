// Utility function to update localStorage and set element state
function updateLocalStorageAndState(checkboxId, inputId, storageKey) {
    const checkbox = document.getElementById(checkboxId);
    const input = document.getElementById(inputId);
    input.disabled = checkboxId.includes('ShowAllCheckbox') ? checkbox.checked : !checkbox.checked;
    localStorage.setItem(storageKey, checkbox.checked);
}

function updateLocalStorageForValue(inputId, storageKey) {
    const input = document.getElementById(inputId);
    localStorage.setItem(storageKey, input.value);
}

function populateDropdown(url, dropdownId) {
    fetch(url)
        .then(response => response.json())
        .then(files => {
            console.log(files);
            const dropdown = document.getElementById(dropdownId);
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error(`Error fetching files from ${url}:`, err));
}

function initializeSettings(settings) {
    settings.forEach(({ checkboxId, inputId, storageKeys, defaultValues }) => {
        const checkboxValue = localStorage.getItem(storageKeys.checkbox) || defaultValues.checkbox;
        const inputValue = parseInt(localStorage.getItem(storageKeys.input)) || defaultValues.input;

        document.getElementById(checkboxId).checked = checkboxValue === "true";
        document.getElementById(inputId).value = inputValue;
        document.getElementById(inputId).disabled = checkboxId.includes('ShowAllCheckbox') ? checkboxValue === "true" : checkboxValue === "false";
    });
}

function saveSettings(settings, preview, storageKeys) {
    const dropdownValue = document.getElementById(settings.dropdownId).value;
    localStorage.setItem(storageKeys.dropdown, dropdownValue);

    settings.checkboxInputs.forEach(({ checkboxId, storageKey }) => {
        localStorage.setItem(storageKey, document.getElementById(checkboxId).checked);
    });

    settings.textInputs.forEach(({ inputId, storageKey }) => {
        localStorage.setItem(storageKey, document.getElementById(inputId).value);
    });

    localStorage.setItem("preview", preview);
    window.location.href = settings.redirectUrl;
}

function switchPage(pageId, buttonId) {
    document.querySelectorAll('.page').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(button => button.classList.remove('tab_active'));

    document.getElementById(pageId).classList.add('active');
    document.getElementById(buttonId).classList.add('tab_active');

    localStorage.setItem("page", pageId);
    localStorage.setItem("button", buttonId);
}

// Initialization
$(document).ready(function () {
    // Populate dropdowns
    populateDropdown('../services/file_lister.php?dir=quizzes', 'quizz_selector');
    populateDropdown('../services/file_lister.php?dir=flashcards', 'flashcard_selector');

    // Initialize settings for quiz and flashcard
    initializeSettings([
        {
            checkboxId: 'quizzTimerCheckbox',
            inputId: 'quizzTimerInput',
            storageKeys: { checkbox: 'quiz_timer_is_on', input: 'quiz_time_span' },
            defaultValues: { checkbox: "false", input: 15 }
        },
        {
            checkboxId: 'quizzShowAllCheckbox',
            inputId: 'quizzNumberInput',
            storageKeys: { checkbox: 'quiz_show_all', input: 'quiz_number' },
            defaultValues: { checkbox: "false", input: 20 }
        },
        {
            checkboxId: 'flashcardTimerCheckbox',
            inputId: 'flashcardTimerInput',
            storageKeys: { checkbox: 'flashcard_timer_is_on', input: 'flashcard_time_span' },
            defaultValues: { checkbox: "false", input: 15 }
        },
        {
            checkboxId: 'flashcardShowAllCheckbox',
            inputId: 'flashcardNumberInput',
            storageKeys: { checkbox: 'flashcard_show_all', input: 'flashcard_number' },
            defaultValues: { checkbox: "false", input: 20 }
        }
    ]);

    document.getElementById("flashcardRandomize").checked = localStorage.getItem("flashcard_randomize") === "true";
    switchPage(localStorage.getItem("page") || "quizz_page", localStorage.getItem("button") || "quizz_tab");
});

// Event handlers
function toggleQuizzTimer() {
    updateLocalStorageAndState('quizzTimerCheckbox', 'quizzTimerInput', 'quiz_timer_is_on');
}

function toggleQuizzShowAll() {
    updateLocalStorageAndState('quizzShowAllCheckbox', 'quizzNumberInput', 'quiz_show_all');
}

function toggleFlashcardTimer() {
    updateLocalStorageAndState('flashcardTimerCheckbox', 'flashcardTimerInput', 'flashcard_timer_is_on');
}

function toggleFlashcardShowAll() {
    updateLocalStorageAndState('flashcardShowAllCheckbox', 'flashcardNumberInput', 'flashcard_show_all');
}

function toggleFlashcardRandomize() {
    const checkbox = document.getElementById('flashcardRandomize');
    localStorage.setItem('flashcard_randomize', checkbox.checked);
}

function startQuizz() {
    saveSettings(
        {
            dropdownId: "quizz_selector",
            checkboxInputs: [
                { checkboxId: 'quizzTimerCheckbox', storageKey: 'quiz_timer_is_on' },
                { checkboxId: 'quizzShowAllCheckbox', storageKey: 'quiz_show_all' }
            ],
            textInputs: [
                { inputId: 'quizzTimerInput', storageKey: 'quiz_time_span' },
                { inputId: 'quizzNumberInput', storageKey: 'quiz_number' }
            ],
            redirectUrl: "../pages/loadpage_quizz.html"
        },
        "false",
        { dropdown: "question_set_path" }
    );
}

function skipQuizz() {
    startQuizz(); // skipQuizz shares logic with startQuizz
    localStorage.setItem("preview", "true");
}

function startFlashcard() {
    saveSettings(
        {
            dropdownId: "flashcard_selector",
            checkboxInputs: [
                { checkboxId: 'flashcardTimerCheckbox', storageKey: 'flashcard_timer_is_on' },
                { checkboxId: 'flashcardShowAllCheckbox', storageKey: 'flashcard_show_all' },
                { checkboxId: 'flashcardRandomize', storageKey: 'flashcard_randomize' }
            ],
            textInputs: [
                { inputId: 'flashcardTimerInput', storageKey: 'flashcard_time_span' },
                { inputId: 'flashcardNumberInput', storageKey: 'flashcard_number' }
            ],
            redirectUrl: "../pages/loadpage_flashcard.html"
        },
        "false",
        { dropdown: "flashcard_question_set_path" }
    );
}