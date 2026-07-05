class Obstacle {
    constructor(laneIndex, z, type) {
        this.laneIndex = laneIndex; // 0, 1, 2
        this.z = z; // depth/distance from camera
        this.type = type; // 'block' or 'overhead'
        this.width = Constants.LANE_WIDTH * 0.6;
        
        if (this.type === 'overhead') {
            this.height = Constants.PLAYER_SIZE * 0.5;
            this.y = Constants.PLAYER_SIZE * 1.5; // High up, must slide
        } else {
            this.height = Constants.PLAYER_SIZE;
            this.y = 0; // On ground, must jump or switch
        }
    }

    update(speed) {
        this.z -= speed;
    }

    isOffScreen() {
        // When it moves behind the camera
        return this.z < -100;
    }

    getHitbox() {
        const laneOffset = (this.laneIndex - 1) * Constants.LANE_WIDTH;
        return {
            x: laneOffset - this.width / 2,
            y: this.y,
            z: this.z, // We use z to check if player has reached it
            width: this.width,
            height: this.height,
            depth: 20 // Thickness of the obstacle
        };
    }
}
