class Constants {
    static GAME_SPEED_START = 8;
    static GAME_SPEED_MAX = 25;
    static SPEED_INCREMENT = 0.5; // Per 20 seconds or so
    
    // Lanes
    static LANES = [-1, 0, 1]; // Left, Center, Right
    static LANE_WIDTH = 100;
    
    // Player
    static PLAYER_SIZE = 40;
    static PLAYER_JUMP_FORCE = 15;
    static GRAVITY = 0.8;
    static SLIDE_DURATION = 30; // frames
    
    // Colors
    static COLOR_NEON_CYAN = '#0ff';
    static COLOR_NEON_MAGENTA = '#f0f';
    static COLOR_BG = '#050510';
    static COLOR_GRID = 'rgba(0, 255, 255, 0.2)';
    static COLOR_PLAYER = '#fff';
    static COLOR_OBSTACLE = '#f0f';
}
