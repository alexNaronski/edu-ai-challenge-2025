import { Board } from './Board.js';
import { Ship } from './Ship.js';

/**
 * Class representing a player in the game
 */
export class Player {
  /**
   * Create a player
   * @param {string} name - Name of the player
   * @param {number} boardSize - Size of the game board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  constructor(name, boardSize, numShips, shipLength) {
    this.name = name;
    this.board = new Board(boardSize);
    this.numShips = numShips;
    this.shipLength = shipLength;
    this.guesses = new Set();
    this.isCPU = name === 'CPU';
    this.cpuMode = 'hunt';
    this.cpuTargetQueue = [];
  }

  /**
   * Place ships randomly on the board
   */
  placeShipsRandomly() {
    let placedShips = 0;
    while (placedShips < this.numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const startRow = orientation === 'horizontal' 
        ? Math.floor(Math.random() * this.board.size)
        : Math.floor(Math.random() * (this.board.size - this.shipLength + 1));
      const startCol = orientation === 'horizontal'
        ? Math.floor(Math.random() * (this.board.size - this.shipLength + 1))
        : Math.floor(Math.random() * this.board.size);

      const locations = [];
      let collision = false;

      for (let i = 0; i < this.shipLength; i++) {
        const row = orientation === 'horizontal' ? startRow : startRow + i;
        const col = orientation === 'horizontal' ? startCol + i : startCol;
        
        if (row >= this.board.size || col >= this.board.size || 
            this.board.grid[row][col] !== '~') {
          collision = true;
          break;
        }
        
        locations.push(`${row}${col}`);
      }

      if (!collision) {
        const ship = new Ship(this.shipLength, locations);
        this.board.placeShip(ship);
        placedShips++;
      }
    }
  }

  /**
   * Make a guess on the opponent's board
   * @param {string} guess - The coordinate to guess
   * @returns {Object} Result of the guess
   */
  makeGuess(guess) {
    if (this.guesses.has(guess)) {
      return { valid: false, message: 'You already guessed that location!' };
    }

    this.guesses.add(guess);
    const result = this.board.processGuess(guess);
    
    // Если это ход CPU, обновляем его стратегию
    if (this.isCPU && result.hit) {
      this.updateCPUTargeting(guess);
    }
    
    return { valid: true, ...result };
  }

  /**
   * Generate a CPU guess
   * @returns {string} The generated guess
   */
  generateCPUGuess() {
    let guess;
    do {
      const row = Math.floor(Math.random() * this.board.grid.length);
      const col = Math.floor(Math.random() * this.board.grid.length);
      guess = `${row}${col}`;
    } while (this.guesses.has(guess));
    
    return guess;
  }

  /**
   * Update CPU targeting after a hit
   * @param {string} hitLocation - The location that was hit
   */
  updateCPUTargeting(hitLocation) {
    const [row, col] = hitLocation.split('').map(Number);
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];

    adjacent.forEach(({ r, c }) => {
      if (r >= 0 && r < this.board.size && c >= 0 && c < this.board.size) {
        const location = `${r}${c}`;
        if (!this.guesses.has(location) && !this.cpuTargetQueue.includes(location)) {
          this.cpuTargetQueue.push(location);
        }
      }
    });
  }
} 