class StorageManager {
    constructor() {
        this.highScore = 0;
        this.loadHighScore();
    }

    loadHighScore() {
        const stored = sessionStorage.getItem('packetDashHighScore');
        if (stored) {
            this.highScore = parseInt(stored, 10);
        }
    }

    saveHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            sessionStorage.setItem('packetDashHighScore', this.highScore.toString());
            return true; // Indicates a new high score
        }
        return false;
    }
}
