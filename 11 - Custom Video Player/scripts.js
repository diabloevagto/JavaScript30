//get our element
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

//build our functions

//播放功能
function togglePlay() {
    (video.paused) ? video.play(): video.pause();
}

//更新播放按鈕圖示
function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚'
    toggle.textContent = icon;
}

//快轉
function skip() {
    video.currentTime += parseFloat(this.dataset['skip']);
}

//更新 range，有音量以及播放速度
function handleRangeUpdate() {
    video[this.name] = this.value;
}

//更新播放進度條
function handleProgress() {
    const percent = video.currentTime / video.duration * 100.0;
    progressBar.style.flexBasis = `${percent}%`;
}

//直接點擊播放條快轉到定位
function scrub(e) {
    video.currentTime = e.offsetX / progress.offsetWidth * video.duration;
}

//hook up the event lister

//監聽點擊播放按鈕及影片被點擊
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

//監聽當前影片停止以及播放事件
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

//監聽影片播放進度，更新播放進度條
video.addEventListener('timeupdate', handleProgress);

//快轉按鈕監聽
skipButtons.forEach(button => button.addEventListener('click', skip));

//監聽 range
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

//進度條監聽
let mousedown = false;
//進度條被點擊或是滑鼠拖拉
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
//只有按下時才會有拖拉效果
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseout', () => mousedown = false);
