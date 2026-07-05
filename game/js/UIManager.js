class UIManager {
    constructor() {
        this.scoreEl = document.getElementById('current-score');
        this.highScoreEl = document.getElementById('high-score');
        
        this.startScreen = document.getElementById('start-screen');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        
        this.finalScoreEl = document.getElementById('final-score');
        this.finalHighScoreEl = document.getElementById('final-high-score');
        
        this.btnPause = document.getElementById('btn-pause');
        this.btnMute = document.getElementById('btn-mute');
        
        this.btnStart = document.getElementById('btn-start');
        this.btnResume = document.getElementById('btn-resume');
        this.btnRestart = document.getElementById('btn-restart');
        this.btnRestartPause = document.getElementById('btn-restart-pause');
        
        this.difficultySelect = document.getElementById('difficulty-select');
    }

    updateScore(score) {
        this.scoreEl.innerText = Math.floor(score);
    }

    updateHighScore(score) {
        this.highScoreEl.innerText = Math.floor(score);
    }

    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    hideScreens() {
        this.startScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
    }

    showPauseScreen() {
        this.pauseScreen.classList.remove('hidden');
    }

    showGameOverScreen(score, highScore) {
        this.finalScoreEl.innerText = Math.floor(score);
        this.finalHighScoreEl.innerText = Math.floor(highScore);
        this.gameOverScreen.classList.remove('hidden');
    }

    updateMuteButton(isMuted) {
        this.btnMute.innerText = isMuted ? '🔇' : '🔊';
        if (isMuted) {
            this.btnMute.style.borderColor = '#888';
            this.btnMute.style.color = '#888';
            this.btnMute.style.boxShadow = 'none';
        } else {
            this.btnMute.style.borderColor = Constants.COLOR_NEON_CYAN;
            this.btnMute.style.color = Constants.COLOR_NEON_CYAN;
            this.btnMute.style.boxShadow = `0 0 10px rgba(0, 255, 255, 0.2)`;
        }
    }
}
