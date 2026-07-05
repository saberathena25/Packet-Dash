class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.width = 0;
        this.height = 0;
        this.cx = 0;
        this.cy = 0;
        
        // Faux 3D projection properties
        this.cameraY = 100;
        this.cameraZ = -200;
        this.fov = 300;

        // Particle system for effects
        this.particles = [];

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cx = this.width / 2;
        this.cy = this.height / 2;
    }

    // Project 3D coordinates to 2D screen coordinates
    project(x, y, z) {
        const relativeZ = z - this.cameraZ;
        if (relativeZ <= 0) return null; // Behind camera
        
        const scale = this.fov / relativeZ;
        const screenX = this.cx + x * scale;
        // Invert Y so positive y is up in game world
        const screenY = this.cy + (this.cameraY - y) * scale;
        
        return { x: screenX, y: screenY, scale: scale };
    }

    clear() {
        this.ctx.fillStyle = Constants.COLOR_BG;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGrid(speed) {
        this.ctx.strokeStyle = Constants.COLOR_GRID;
        this.ctx.lineWidth = 1;

        // Draw horizon
        this.ctx.beginPath();
        const horizon = this.project(0, 0, 2000);
        if (horizon) {
            this.ctx.moveTo(0, horizon.y);
            this.ctx.lineTo(this.width, horizon.y);
        }
        this.ctx.stroke();

        // Draw lane separators (4 lines for 3 lanes)
        for (let i = -1.5; i <= 1.5; i++) {
            const x = i * Constants.LANE_WIDTH;
            this.ctx.beginPath();
            
            for (let z = 0; z < 2000; z += 100) {
                const p = this.project(x, 0, z);
                if (p) {
                    if (z === 0) this.ctx.moveTo(p.x, p.y);
                    else this.ctx.lineTo(p.x, p.y);
                }
            }
            this.ctx.stroke();
        }
    }

    drawPlayer(player) {
        const laneOffset = (player.currentVisualLane - 1) * Constants.LANE_WIDTH;
        let p = this.project(laneOffset, player.y, 0); // Player is at z=0

        if (!p) return;

        this.ctx.fillStyle = Constants.COLOR_PLAYER;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = Constants.COLOR_PLAYER;

        // Adjust size based on state
        let h = Constants.PLAYER_SIZE * p.scale;
        let w = Constants.PLAYER_SIZE * p.scale * 0.8;
        
        if (player.isSliding) {
            h *= 0.5;
            p.y += (Constants.PLAYER_SIZE * p.scale * 0.25); // Shift down
        }

        // Simple glowing cube for player
        this.ctx.fillRect(p.x - w/2, p.y - h, w, h);
        
        this.ctx.shadowBlur = 0; // reset
    }

    drawObstacles(obstacles) {
        // Sort by Z descending so furthest are drawn first
        const sorted = [...obstacles].sort((a, b) => b.z - a.z);

        for (let obs of sorted) {
            const laneOffset = (obs.laneIndex - 1) * Constants.LANE_WIDTH;
            const p = this.project(laneOffset, obs.y, obs.z);
            
            if (!p) continue;

            const w = obs.width * p.scale;
            const h = obs.height * p.scale;

            this.ctx.fillStyle = Constants.COLOR_OBSTACLE;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = Constants.COLOR_OBSTACLE;

            // Simple neon block
            this.ctx.fillRect(p.x - w/2, p.y - h, w, h);
            
            // Draw inner wireframe for style
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(p.x - w/2, p.y - h, w, h);

            this.ctx.shadowBlur = 0;
        }
    }

    addCrashParticles(player) {
        const laneOffset = (player.currentVisualLane - 1) * Constants.LANE_WIDTH;
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: laneOffset,
                y: player.y + Constants.PLAYER_SIZE/2,
                z: 0,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.2) * 20,
                vz: (Math.random() - 0.5) * 20,
                life: 1.0
            });
        }
    }

    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let pt = this.particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.z += pt.vz;
            pt.vy -= Constants.GRAVITY * 0.5; // gravity
            pt.life -= 0.02;

            if (pt.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            const p = this.project(pt.x, pt.y, pt.z);
            if (p) {
                this.ctx.fillStyle = `rgba(255, 0, 255, ${pt.life})`;
                const size = 5 * p.scale;
                this.ctx.fillRect(p.x - size/2, p.y - size/2, size, size);
            }
        }
    }
}
