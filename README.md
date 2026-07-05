# Packet Dash
**Packet Dash** (also known as Packet Rush) is a fast-paced, 3-lane endless runner web game with a neon/cyberpunk aesthetic. Dodge obstacles by jumping, sliding, or switching lanes as you travel down a digital grid that progressively speeds up!
## Features
- **Endless Runner Gameplay:** Survive as long as you can while the speed continuously increases.
- **Classic Controls:** Switch between 3 lanes, jump over low obstacles, and slide under high obstacles.
- **Neon Aesthetic:** Stylish retro-futuristic visuals built using HTML5 Canvas.
- **Difficulty Modes:** Choose between Easy, Normal, and Hard to fit your playstyle.
- **Persistent High Scores:** Your best score is saved locally in your browser.
- **Audio & Pause Controls:** Integrated audio and the ability to pause the game at any time.
## How to Play
### Controls
*   **Left Arrow (`←`)**: Move to the left lane
*   **Right Arrow (`→`)**: Move to the right lane
*   **Spacebar (`SPACE`)**: Jump over ground obstacles
*   **Down Arrow (`↓`)**: Slide under high obstacles
*   **`P`**: Pause / Resume game
*   **`M`**: Mute / Unmute audio
### Gameplay
1. Open `game/index.html` in your web browser.
2. Select your desired difficulty level (Easy, Normal, Hard).
3. Click **INITIALIZE** to start the connection and begin the run.
4. Avoid the magenta obstacles and survive as long as possible to achieve a high score!
## Technologies Used
- **HTML5 & CSS3:** For game UI, overlays, and responsive layout.
- **HTML5 Canvas:** For rendering the game world and entities.
- **Vanilla JavaScript:** Object-oriented JS used for game logic, physics, entity management, and input handling. 
    - No external frameworks or libraries are used.
## Project Structure
```text
Packet Rush/
├── README.md               # This file
└── game/
    ├── index.html          # Main game entry point and UI markup
    ├── style.css           # Game UI and overlay styling
    ├── assets/             # Game assets (audio, images, etc.)
    └── js/                 # Game scripts
        ├── AudioManager.js # Handles game sounds and music
        ├── Constants.js    # Global variables, settings, and colors
        ├── InputManager.js # Keyboard input detection
        ├── main.js         # Core game loop and initialization
        ├── Obstacle.js     # Obstacle entity class
        ├── ObstacleManager.js # Obstacle spawning logic
        ├── Player.js       # Player entity and movement logic
        ├── Renderer.js     # Canvas drawing and visual effects
        ├── StorageManager.js # Handles local storage for high scores
        └── UIManager.js    # Menus and UI interactions
```
## Running the Game
No build steps or server are strictly required. You can simply open `game/index.html` in any modern web browser to play. 
*(Note: Depending on your browser's strict security settings, running directly from the filesystem `file://` might block certain features like local storage or audio. If this happens, serve the directory using a simple local web server, e.g., `python -m http.server` or a VS Code Live Server extension.)*
