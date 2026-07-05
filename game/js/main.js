// main.js - Core game loop and orchestration
let game;

class Game {
    constructor() {
        this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER
        
        // Initialize managers
        this.storage = new StorageManager();
        this.audio = new AudioManager();
        this.input = new InputManager();
        this.ui = new UIManager();
        this.renderer = new Renderer('game-canvas');
        
        // Game Entities
        this.player = new Player();
        this.obstacleManager = new ObstacleManager();
        
        // Game variables
        this.score = 0;
        this.speed = Constants.GAME_SPEED_START;
        
        this.bindEvents();
        
        // Setup initial UI
        this.ui.updateHighScore(this.storage.highScore);
        this.ui.showStartScreen();

        // Start render loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    bindEvents() {
        // UI Buttons
        this.ui.btnStart.addEventListener('click', () => this.start());
        this.ui.btnRestart.addEventListener('click', () => this.start());
        this.ui.btnResume.addEventListener('click', () => this.togglePause());
        this.ui.btnRestartPause.addEventListener('click', () => this.start());
        
        this.ui.btnPause.addEventListener('click', () => {
            if (this.state === 'PLAYING') this.togglePause();
        });
        
        this.ui.btnMute.addEventListener('click', () => {
            const isMuted = this.audio.toggleMute();
            this.ui.updateMuteButton(isMuted);
        });
    }

    start() {
        this.state = 'PLAYING';
        this.score = 0;
        this.ui.updateHighScore(this.storage.highScore);
        
        const diff = this.ui.difficultySelect.value;
        if (diff === 'easy') {
            this.speed = Constants.GAME_SPEED_START * 0.75;
            this.obstacleManager.baseSpawnRate = 80;
        } else if (diff === 'hard') {
            this.speed = Constants.GAME_SPEED_START * 1.5;
            this.obstacleManager.baseSpawnRate = 45;
        } else {
            this.speed = Constants.GAME_SPEED_START;
            this.obstacleManager.baseSpawnRate = 60;
        }
        
        this.player.reset();
        this.obstacleManager.reset();
        this.renderer.particles = [];
        
        this.ui.hideScreens();
        
        // Remove focus from any active UI buttons so pressing Spacebar to jump
        // doesn't accidentally trigger a restart button again.
        if (document.activeElement) {
            document.activeElement.blur();
        }
        
        // Resume audio context if it was suspended
        if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
            this.audio.ctx.resume();
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.audio.playSound('hit');
        this.renderer.addCrashParticles(this.player);
        
        // Add screen shake effect by manipulating camera temporarily
        let shake = 20;
        const shakeInterval = setInterval(() => {
            this.renderer.cx = this.renderer.width/2 + (Math.random() - 0.5) * shake;
            this.renderer.cy = this.renderer.height/2 + (Math.random() - 0.5) * shake;
            shake *= 0.8;
            if (shake < 1) {
                clearInterval(shakeInterval);
                this.renderer.cx = this.renderer.width/2;
                this.renderer.cy = this.renderer.height/2;
            }
        }, 30);

        this.storage.saveHighScore(Math.floor(this.score));
        
        setTimeout(() => {
            this.ui.showGameOverScreen(this.score, this.storage.highScore);
        }, 1000); // Wait 1s before showing screen to let particles fly
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.ui.showPauseScreen();
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.ui.hideScreens();
        }
    }

    update(dt) {
        if (this.state !== 'PLAYING') {
            if (this.input.justPressed.pause && this.state === 'PAUSED') {
                this.togglePause();
            }
            if (this.state === 'GAMEOVER' && this.renderer.particles.length > 0) {
                // Keep updating particles during game over
            } else {
                this.input.reset();
                return;
            }
        }

        if (this.state === 'PLAYING') {
            if (this.input.justPressed.pause) {
                this.togglePause();
                this.input.reset();
                return;
            }

            // Update Entities
            this.player.update(this.input, this.audio);
            this.obstacleManager.update(this.speed);

            // Check Collisions
            if (this.obstacleManager.checkCollision(this.player)) {
                this.gameOver();
            }

            // Update Score & Speed
            this.score += (this.speed / 60) * 10; // 10 points per z-unit roughly
            this.ui.updateScore(this.score);
            
            if (this.score > this.storage.highScore) {
                this.storage.highScore = this.score;
                this.ui.updateHighScore(this.score);
            }

            // Increase difficulty
            this.speed = Math.min(Constants.GAME_SPEED_MAX, this.speed + 0.002);
        }

        this.input.reset();
    }

    render() {
        this.renderer.clear();
        
        // Draw moving grid
        // We can simulate movement by passing an offset based on score/time, but simple lines are fine
        this.renderer.drawGrid(this.speed);
        
        this.renderer.drawObstacles(this.obstacleManager.obstacles);
        
        if (this.state !== 'GAMEOVER' || this.renderer.particles.length > 0) {
            this.renderer.drawPlayer(this.player);
        }

        this.renderer.drawParticles();
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    // Expose uimanager globally for storage manager fallback
    window.uiManager = game.ui;
});
