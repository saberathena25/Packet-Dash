class Player {
    constructor() {
        this.reset();
    }

    reset() {
        this.laneIndex = 1; // Start in center lane (0=left, 1=center, 2=right)
        
        this.y = 0; // vertical position (jump height)
        this.vy = 0; // vertical velocity
        
        this.isJumping = false;
        this.isSliding = false;
        this.slideTimer = 0;
        
        // For smooth lane transition
        this.currentVisualLane = this.laneIndex; 
    }

    update(input, audio) {
        // Handle lane switching
        if (input.justPressed.left && this.laneIndex > 0) {
            this.laneIndex--;
            audio.playSound('switch');
        } else if (input.justPressed.right && this.laneIndex < 2) {
            this.laneIndex++;
            audio.playSound('switch');
        }

        // Smoothly interpolate visual lane position
        this.currentVisualLane += (this.laneIndex - this.currentVisualLane) * 0.2;

        // Handle Jump
        if (input.justPressed.up && !this.isJumping && !this.isSliding) {
            this.isJumping = true;
            this.vy = Constants.PLAYER_JUMP_FORCE;
            audio.playSound('jump');
        }

        // Handle Slide
        if (input.justPressed.down && !this.isJumping && !this.isSliding) {
            this.isSliding = true;
            this.slideTimer = Constants.SLIDE_DURATION;
            audio.playSound('switch'); // Use switch sound for slide too for now
        }

        // Apply Gravity if jumping
        if (this.isJumping) {
            this.y += this.vy;
            this.vy -= Constants.GRAVITY;

            if (this.y <= 0) {
                this.y = 0;
                this.isJumping = false;
                this.vy = 0;
            }
        }

        // Handle Slide duration
        if (this.isSliding) {
            this.slideTimer--;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
            }
        }
    }

    getHitbox() {
        // Returns a relative hitbox depending on state
        // x offset based on visual lane to make it forgiving but accurate
        const laneOffset = (this.currentVisualLane - 1) * Constants.LANE_WIDTH;
        
        let height = Constants.PLAYER_SIZE;
        let yOffset = this.y;

        if (this.isSliding) {
            height = Constants.PLAYER_SIZE / 2; // Half height when sliding
        }

        return {
            x: laneOffset - Constants.PLAYER_SIZE / 2 + 5,
            y: yOffset,
            width: Constants.PLAYER_SIZE - 10,
            height: height
        };
    }
}
