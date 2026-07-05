class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            pause: false
        };
        
        // Only trigger once per press for certain actions
        this.justPressed = {
            left: false,
            right: false,
            up: false,
            down: false,
            pause: false
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Touch support (swipe)
        let touchStartX = 0;
        let touchStartY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: false});

        window.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        }, {passive: false});
    }

    handleKeyDown(e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            if (!this.keys.left) this.justPressed.left = true;
            this.keys.left = true;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            if (!this.keys.right) this.justPressed.right = true;
            this.keys.right = true;
        }
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
            if (!this.keys.up) this.justPressed.up = true;
            this.keys.up = true;
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            if (!this.keys.down) this.justPressed.down = true;
            this.keys.down = true;
        }
        if (e.code === 'KeyP' || e.code === 'Escape') {
            if (!this.keys.pause) this.justPressed.pause = true;
            this.keys.pause = true;
        }
    }

    handleKeyUp(e) {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = false;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = false;
        if (e.code === 'KeyP' || e.code === 'Escape') this.keys.pause = false;
    }

    handleSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const minSwipeDistance = 30;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) this.justPressed.right = true;
                else this.justPressed.left = true;
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) this.justPressed.down = true;
                else this.justPressed.up = true;
            }
        }
    }

    // Call this at the end of each frame
    reset() {
        this.justPressed.left = false;
        this.justPressed.right = false;
        this.justPressed.up = false;
        this.justPressed.down = false;
        this.justPressed.pause = false;
    }
}
