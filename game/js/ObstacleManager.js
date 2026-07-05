class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.baseSpawnRate = 60; // Frames between spawns
        this.spawnZ = 1500; // Far in distance
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }

    update(speed) {
        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.update(speed);
            if (obs.isOffScreen()) {
                this.obstacles.splice(i, 1);
            }
        }

        // Spawn logic
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnObstacles(speed);
            // Adjust spawn rate based on speed (faster = spawn more often)
            let baseTimer = Math.max(20, this.baseSpawnRate - (speed - Constants.GAME_SPEED_START) * 2);
            
            // Increase total obstacles by 10% by reducing the timer by 10%
            baseTimer *= 0.9;
            
            // Add timing randomness (+/- 25%) so distances between obstacles vary wildly
            const randomVariance = baseTimer * 0.25;
            this.spawnTimer = baseTimer + (Math.random() * randomVariance * 2 - randomVariance);
        }
    }

    spawnObstacles(speed) {
        // Decide how many obstacles to spawn (1 or 2)
        // Increased chance of 2 obstacles to 45% for more randomness and difficulty
        const numObstacles = Math.random() > 0.55 ? 2 : 1;
        let usedLanes = [];

        for (let i = 0; i < numObstacles; i++) {
            let lane;
            do {
                lane = Math.floor(Math.random() * 3);
            } while (usedLanes.includes(lane));
            
            usedLanes.push(lane);

            // Decide type: overhead (need to slide) or block (need to jump/dodge)
            // Increased overhead spawn chance to 25% to force more varied movement
            const type = Math.random() > 0.75 ? 'overhead' : 'block';
            
            this.obstacles.push(new Obstacle(lane, this.spawnZ, type));
        }
    }

    checkCollision(player) {
        const pBox = player.getHitbox();
        // Player is roughly at z = 0
        const pZ = 0;
        const pDepth = 20;

        for (let obs of this.obstacles) {
            const oBox = obs.getHitbox();

            // Z collision (depth)
            if (pZ + pDepth > oBox.z && pZ < oBox.z + oBox.depth) {
                // X collision (lane)
                if (pBox.x < oBox.x + oBox.width && pBox.x + pBox.width > oBox.x) {
                    // Y collision (height)
                    if (pBox.y < oBox.y + oBox.height && pBox.y + pBox.height > oBox.y) {
                        return true; // Collision detected
                    }
                }
            }
        }
        return false;
    }
}
