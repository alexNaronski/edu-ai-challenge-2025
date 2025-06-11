/**
 * Class representing a game board
 */
export class Board {
  /**
   * Create a game board
   * @param {number} size - Size of the board (size x size)
   */
  constructor(size) {
    this.size = size;
    this.grid = Array(size).fill().map(() => Array(size).fill('~'));
    this.ships = [];
  }

  /**
   * Place a ship on the board
   * @param {Ship} ship - The ship to place
   * @param {boolean} showShip - Whether to show the ship on the board
   */
  placeShip(ship, showShip = false) {
    ship.locations.forEach(location => {
      const [row, col] = location.split('').map(Number);
      this.grid[row][col] = showShip ? 'S' : '~';
    });
    this.ships.push(ship);
  }

  /**
   * Process a guess on the board
   * @param {string} guess - The coordinate to guess
   * @returns {Object} Result of the guess
   */
  processGuess(guess) {
    const [row, col] = guess.split('').map(Number);
    
    if (this.grid[row][col] === 'X' || this.grid[row][col] === 'O') {
      return { hit: false, message: 'You already guessed that location!' };
    }

    for (const ship of this.ships) {
      if (ship.hasLocation(guess)) {
        if (ship.processHit(guess)) {
          this.grid[row][col] = 'X';
          const sunk = ship.isSunk();
          return {
            hit: true,
            sunk,
            message: sunk ? 'Ship sunk!' : 'Hit!'
          };
        }
      }
    }

    this.grid[row][col] = 'O';
    return { hit: false, message: 'Miss!' };
  }

  /**
   * Get the current state of the board
   * @returns {string[][]} The current board state
   */
  getState() {
    return this.grid;
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} True if all ships are sunk
   */
  areAllShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
} 