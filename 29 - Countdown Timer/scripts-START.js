let countdown;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;

    displayTimeLeft(seconds);
    displayEndTime(then);
    clearInterval(countdown);

    countdown = setInterval(() => {
        const secondsLeft = Math.round(then - Date.now()) / 1000;
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60) + '';
    const remainderSeconds = (seconds % 60) + '';
    const display = `${minutes.padStart(2, "0")}:${remainderSeconds.padStart(2, "0")}`;

    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hours = end.getHours().toString().padStart(2, "0");
    const minutes = end.getMinutes().toString().padStart(2, "0");
    const display = `Be Back At ${hours}:${minutes}`;

    endTime.textContent = display;
}

function startTimer() {
    timer(this.dataset.time);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
})
