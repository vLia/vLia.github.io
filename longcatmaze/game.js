
class MazeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 20;
        this.mazeWidth = 25;
        this.mazeHeight = 25;
        this.canvas.width = this.mazeWidth * this.cellSize;
        this.canvas.height = this.mazeHeight * this.cellSize;
        
        this.maze = [];
        this.cat = [];
        this.direction = null;
        this.gameWon = false;
        this.startPos = null;
        this.endPos = null;
        this.sconeImage = new Image();
        this.headImage = new Image();
        this.bodyImage = new Image();
        this.cornerImage = new Image();
        this.legsImage = new Image();
        this.legsRotationDirection = null; // Store the initial direction for legs rotation
        
        // Track loaded images
        let imagesLoaded = 0;
        const totalImages = 5;
        
        const checkAllLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                this.init();
                this.setupControls();
            }
        };
        
        // Load scone image
        this.sconeImage.onload = checkAllLoaded;
        this.sconeImage.onerror = () => {
            console.error('Failed to load scone image');
            checkAllLoaded();
        };
        this.sconeImage.src = 'images/scone.png';
        
        // Load head image
        this.headImage.onload = checkAllLoaded;
        this.headImage.onerror = () => {
            console.error('Failed to load head image');
            checkAllLoaded();
        };
        this.headImage.src = 'images/head.png';
        
        // Load body image
        this.bodyImage.onload = checkAllLoaded;
        this.bodyImage.onerror = () => {
            console.error('Failed to load body image');
            checkAllLoaded();
        };
        this.bodyImage.src = 'images/body.png';
        
        // Load corner image
        this.cornerImage.onload = checkAllLoaded;
        this.cornerImage.onerror = () => {
            console.error('Failed to load corner image');
            checkAllLoaded();
        };
        this.cornerImage.src = 'images/corner.png';
        
        // Load legs image
        this.legsImage.onload = checkAllLoaded;
        this.legsImage.onerror = () => {
            console.error('Failed to load legs image');
            checkAllLoaded();
        };
        this.legsImage.src = 'images/legs.png';
    }
    
    init() {
        this.generateMaze();
        this.placeCat();
        this.draw();
    }
    
    generateMaze() {
        // Initialize maze with all walls (scones)
        this.maze = Array(this.mazeHeight).fill(null).map(() => 
            Array(this.mazeWidth).fill(1)
        );
        
        // Use recursive backtracking to generate maze
        const stack = [];
        const visited = Array(this.mazeHeight).fill(null).map(() => 
            Array(this.mazeWidth).fill(false)
        );
        
        // Start from top-left
        let current = {x: 0, y: 0};
        this.maze[0][0] = 0;
        visited[0][0] = true;
        stack.push(current);
        
        const directions = [
            {x: 0, y: -1}, // up
            {x: 1, y: 0},  // right
            {x: 0, y: 1},  // down
            {x: -1, y: 0}  // left
        ];
        
        while (stack.length > 0) {
            const neighbors = [];
            
            for (const dir of directions) {
                const nx = current.x + dir.x * 2;
                const ny = current.y + dir.y * 2;
                
                if (nx >= 0 && nx < this.mazeWidth && 
                    ny >= 0 && ny < this.mazeHeight && 
                    !visited[ny][nx]) {
                    neighbors.push({x: nx, y: ny, dir: dir});
                }
            }
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                const wallX = current.x + next.dir.x;
                const wallY = current.y + next.dir.y;
                
                this.maze[wallY][wallX] = 0;
                this.maze[next.y][next.x] = 0;
                visited[next.y][next.x] = true;
                
                stack.push(current);
                current = {x: next.x, y: next.y};
            } else {
                current = stack.pop();
            }
        }
        
        // Set start and end positions (opposite corners)
        this.startPos = {x: 0, y: 0};
        this.endPos = {x: this.mazeWidth - 1, y: this.mazeHeight - 1};
        
        // Ensure start and end are open
        this.maze[0][0] = 0;
        this.maze[this.mazeHeight - 1][this.mazeWidth - 1] = 0;
    }
    
    placeCat() {
        this.cat = [{x: this.startPos.x, y: this.startPos.y, direction: null}];
        this.direction = null;
        this.legsRotationDirection = null;
        this.gameWon = false;
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameWon) return;
            
            let newDirection = null;
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.direction !== 'down') newDirection = 'up';
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.direction !== 'up') newDirection = 'down';
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.direction !== 'right') newDirection = 'left';
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.direction !== 'left') newDirection = 'right';
                    break;
            }
            
            if (newDirection) {
                // Set legs rotation direction on first move
                if (this.legsRotationDirection === null) {
                    this.legsRotationDirection = newDirection;
                }
                this.direction = newDirection;
                this.moveCat();
                this.draw();
            }
        });
        
        // Button controls
        document.getElementById('upBtn').addEventListener('click', () => {
            if (this.gameWon) return;
            if (this.direction !== 'down') {
                // Set legs rotation direction on first move
                if (this.legsRotationDirection === null) {
                    this.legsRotationDirection = 'up';
                }
                this.direction = 'up';
                this.moveCat();
                this.draw();
            }
        });
        
        document.getElementById('downBtn').addEventListener('click', () => {
            if (this.gameWon) return;
            if (this.direction !== 'up') {
                // Set legs rotation direction on first move
                if (this.legsRotationDirection === null) {
                    this.legsRotationDirection = 'down';
                }
                this.direction = 'down';
                this.moveCat();
                this.draw();
            }
        });
        
        document.getElementById('leftBtn').addEventListener('click', () => {
            if (this.gameWon) return;
            if (this.direction !== 'right') {
                // Set legs rotation direction on first move
                if (this.legsRotationDirection === null) {
                    this.legsRotationDirection = 'left';
                }
                this.direction = 'left';
                this.moveCat();
                this.draw();
            }
        });
        
        document.getElementById('rightBtn').addEventListener('click', () => {
            if (this.gameWon) return;
            if (this.direction !== 'left') {
                // Set legs rotation direction on first move
                if (this.legsRotationDirection === null) {
                    this.legsRotationDirection = 'right';
                }
                this.direction = 'right';
                this.moveCat();
                this.draw();
            }
        });
        
        // New game button
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.init();
            document.getElementById('statusText').textContent = 'Press an arrow to start!';
        });
    }
    
    moveCat() {
        if (!this.direction || this.gameWon) return;
        
        const head = {...this.cat[0]};
        
        // Calculate new head position
        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check boundaries and walls
        if (head.x < 0 || head.x >= this.mazeWidth || 
            head.y < 0 || head.y >= this.mazeHeight ||
            this.maze[head.y][head.x] === 1) {
            // Hit a wall - game over
            this.gameOver();
            return;
        }
        
        // Check if cat hits itself
        if (this.cat.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        // Store the direction when this segment was created
        head.direction = this.direction;
        
        // Add new head
        this.cat.unshift(head);
        // Don't remove tail - cat grows!
        
        // Check if reached the end
        if (head.x === this.endPos.x && head.y === this.endPos.y) {
            this.gameWon = true;
            document.getElementById('statusText').textContent = 
                `You won! Cat length: ${this.cat.length}`;
            return;
        }
        
        // Update status
        document.getElementById('statusText').textContent = 
            `Cat length: ${this.cat.length} | Goal: Reach the exit!`;
    }
    
    gameOver() {
        this.gameWon = false;
        document.getElementById('statusText').textContent = 
            `Game Over! Cat length: ${this.cat.length} | Click "New Game" to try again!`;
        this.direction = null;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#ADD8E6';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze (scones/walls)
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (this.maze[y][x] === 1) {
                    // Draw scone image if loaded, otherwise fallback to brown rectangle
                    if (this.sconeImage.complete && this.sconeImage.naturalWidth > 0) {
                        this.ctx.drawImage(
                            this.sconeImage,
                            x * this.cellSize,
                            y * this.cellSize,
                            this.cellSize,
                            this.cellSize
                        );
                    } else {
                        // Fallback: draw brown rectangle
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.fillRect(
                            x * this.cellSize, 
                            y * this.cellSize, 
                            this.cellSize, 
                            this.cellSize
                        );
                    }
                }
            }
        }
        
        // Draw end position (green square)
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(
            this.endPos.x * this.cellSize + 2,
            this.endPos.y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
        
        // Draw start position (blue square) - only if cat hasn't moved
        if (this.cat.length === 1 && this.cat[0].x === this.startPos.x && 
            this.cat[0].y === this.startPos.y) {
            this.ctx.fillStyle = '#2196F3';
            this.ctx.fillRect(
                this.startPos.x * this.cellSize + 2,
                this.startPos.y * this.cellSize + 2,
                this.cellSize - 4,
                this.cellSize - 4
            );
        }
        
        // Draw cat
        this.cat.forEach((segment, index) => {
            if (index === 0) {
                // Head - use head image if loaded, otherwise fallback to orange circle
                if (this.headImage.complete && this.headImage.naturalWidth > 0) {
                    // Calculate rotation angle based on direction
                    let rotation = 0;
                    if (this.direction === 'down') {
                        rotation = Math.PI; // 180 degrees - upside down
                    } else if (this.direction === 'left') {
                        rotation = -Math.PI / 2; // -90 degrees - turned left
                    } else if (this.direction === 'right') {
                        rotation = Math.PI / 2; // 90 degrees - turned right
                    }
                    // up: rotation stays 0 (straight)
                    
                    // Save context, rotate, draw, restore
                    this.ctx.save();
                    const centerX = segment.x * this.cellSize + this.cellSize / 2;
                    const centerY = segment.y * this.cellSize + this.cellSize / 2;
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(rotation);
                    this.ctx.drawImage(
                        this.headImage,
                        -this.cellSize / 2,
                        -this.cellSize / 2,
                        this.cellSize,
                        this.cellSize
                    );
                    this.ctx.restore();
                } else {
                    // Fallback: draw orange circle
                    this.ctx.fillStyle = '#FFA500';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        segment.x * this.cellSize + this.cellSize / 2,
                        segment.y * this.cellSize + this.cellSize / 2,
                        this.cellSize / 2 - 2,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                }
            } else if (index === this.cat.length - 1) {
                // Last segment (legs) - use legs image if loaded
                if (this.legsImage.complete && this.legsImage.naturalWidth > 0) {
                    // Calculate rotation angle based on initial direction (only set once)
                    let rotation = 0;
                    if (this.legsRotationDirection === 'down') {
                        rotation = Math.PI; // 180 degrees - upside down
                    } else if (this.legsRotationDirection === 'left') {
                        rotation = -Math.PI / 2; // -90 degrees - turned left
                    } else if (this.legsRotationDirection === 'right') {
                        rotation = Math.PI / 2; // 90 degrees - turned right
                    }
                    // up: rotation stays 0 (straight)
                    
                    // Save context, rotate, draw, restore
                    this.ctx.save();
                    const centerX = segment.x * this.cellSize + this.cellSize / 2;
                    const centerY = segment.y * this.cellSize + this.cellSize / 2;
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(rotation);
                    this.ctx.drawImage(
                        this.legsImage,
                        -this.cellSize / 2,
                        -this.cellSize / 2,
                        this.cellSize,
                        this.cellSize
                    );
                    this.ctx.restore();
                } else {
                    // Fallback: draw orange rectangle
                    this.ctx.fillStyle = '#FF8C00'; // Darker orange
                    this.ctx.fillRect(
                        segment.x * this.cellSize + 2,
                        segment.y * this.cellSize + 2,
                        this.cellSize - 4,
                        this.cellSize - 4
                    );
                }
            } else {
                // Middle segments (body) - check if this is a corner
                const segmentDirection = segment.direction || this.direction;
                const prevSegment = this.cat[index - 1];
                const prevDirection = prevSegment ? (prevSegment.direction || this.direction) : segmentDirection;
                const isCorner = prevDirection !== segmentDirection;
                
                if (isCorner && this.cornerImage.complete && this.cornerImage.naturalWidth > 0) {
                    // Calculate rotation for corner based on turn direction
                    let rotation = this.getCornerRotation(prevDirection, segmentDirection);
                    
                    // Check if the last body segment (next segment) is rotated
                    const nextSegment = this.cat[index + 1];
                    const nextDirection = nextSegment ? (nextSegment.direction || this.direction) : segmentDirection;
                    const isLastBodyRotated = nextDirection !== 'up' && nextDirection !== null;
                    
                    // Save context, rotate, draw, restore
                    this.ctx.save();
                    const centerX = segment.x * this.cellSize + this.cellSize / 2;
                    const centerY = segment.y * this.cellSize + this.cellSize / 2;
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(rotation);
                    
                    // Mirror horizontally if last body is rotated, otherwise mirror vertically
                    if (isLastBodyRotated) {
                        this.ctx.scale(-1, 1); // Horizontal mirror
                    } else {
                        this.ctx.scale(1, -1); // Vertical mirror
                    }
                    
                    this.ctx.drawImage(
                        this.cornerImage,
                        -this.cellSize / 2,
                        -this.cellSize / 2,
                        this.cellSize,
                        this.cellSize
                    );
                    this.ctx.restore();
                } else if (this.bodyImage.complete && this.bodyImage.naturalWidth > 0) {
                    // Straight segment - use body image
                    // Calculate rotation angle based on the direction when this segment was created
                    let rotation = 0;
                    if (segmentDirection === 'down') {
                        rotation = Math.PI; // 180 degrees - upside down
                    } else if (segmentDirection === 'left') {
                        rotation = -Math.PI / 2; // -90 degrees - turned left
                    } else if (segmentDirection === 'right') {
                        rotation = Math.PI / 2; // 90 degrees - turned right
                    }
                    // up: rotation stays 0 (straight)
                    
                    // Save context, rotate, draw, restore
                    this.ctx.save();
                    const centerX = segment.x * this.cellSize + this.cellSize / 2;
                    const centerY = segment.y * this.cellSize + this.cellSize / 2;
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(rotation);
                    this.ctx.drawImage(
                        this.bodyImage,
                        -this.cellSize / 2,
                        -this.cellSize / 2,
                        this.cellSize,
                        this.cellSize
                    );
                    this.ctx.restore();
                } else {
                    // Fallback: draw orange rectangle
                    this.ctx.fillStyle = '#FF8C00'; // Darker orange
                    this.ctx.fillRect(
                        segment.x * this.cellSize + 2,
                        segment.y * this.cellSize + 2,
                        this.cellSize - 4,
                        this.cellSize - 4
                    );
                }
            }
        });
        
        // Gray out the maze and show "You won!" if game is won
        if (this.gameWon) {
            // Draw semi-transparent gray overlay
            this.ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw "You won!" text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3;
            const textX = this.canvas.width / 2;
            const textY = this.canvas.height / 2;
            this.ctx.strokeText('You won!', textX, textY);
            this.ctx.fillText('You won!', textX, textY);
        }
    }

    getCornerRotation(fromDir, toDir) {
        // Map directions to angles: up=0, right=90, down=180, left=270
        const dirToAngle = {
            'up': 0,
            'right': Math.PI / 2,
            'down': Math.PI,
            'left': -Math.PI / 2
        };
        
        const fromAngle = dirToAngle[fromDir] || 0;
        const toAngle = dirToAngle[toDir] || 0;
        
        // Calculate the turn angle
        let turnAngle = toAngle - fromAngle;
        
        // Normalize to 0-360 range
        if (turnAngle < 0) turnAngle += 2 * Math.PI;
        
        // Base rotation for corner image (down to right = 0)
        // The corner image is oriented for down→right turn
        // We need to rotate it based on the actual turn
        let baseRotation = 0;
        
        // Map specific turns to rotations as specified:
        // Down to Right: 0° (base)
        // Left to Down: 90°
        // Up to Right: 180°
        if (fromDir === 'down') {
            if (toDir === 'right') { baseRotation = 0; return baseRotation; }
            if (toDir === 'left') { baseRotation = -Math.PI/2; return baseRotation; }
        }
        if(fromDir === 'left') { 
            if (toDir === 'down') { baseRotation = Math.PI / 2; return baseRotation; }
            if (toDir === 'up') { baseRotation = Math.PI; return baseRotation; }
        }
        if(fromDir === 'up') { 
            if (toDir === 'right') { baseRotation = Math.PI / 2; return baseRotation; }
            if (toDir === 'left') { baseRotation = -Math.PI; return baseRotation; }
        }
        if(fromDir === 'right') { 
            if (toDir === 'down') { baseRotation = Math.PI; return baseRotation; }
            if (toDir === 'up') { baseRotation = Math.PI/2; return baseRotation; }
        } else {
            // Default: calculate based on turn angle
            baseRotation = 0;//turnAngle;
        }
        
        return baseRotation;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new MazeGame();
});

