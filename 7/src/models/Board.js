/**
 * Class representing a game board
 */
import { Ship } from './Ship.js';

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
  placeShip(ship) {
    const shipInstance = new Ship(ship.length);
    shipInstance.locations = ship.locations;
    this.ships.push(shipInstance);
    
    for (const location of ship.locations) {
      const [row, col] = location.split('').map(Number);
      this.grid[row][col] = 'S';
    }
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
  getState(showShips = false) {
    const state = Array(this.size).fill().map(() => Array(this.size).fill('~'));
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 'X' || this.grid[i][j] === 'O') {
          state[i][j] = this.grid[i][j];
        } else if (showShips && this.grid[i][j] === 'S') {
          state[i][j] = 'S';
        }
      }
    }
    
    return state;
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} True if all ships are sunk
   */
  isAllShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
} 