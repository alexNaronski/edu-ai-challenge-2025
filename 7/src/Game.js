import { Player } from './models/Player.js';
import { GameUI } from './ui/GameUI.js';

/**
 * Class representing the Sea Battle game
 */
export class Game {
  /**
   * Create a new game
   * @param {Object} config - Game configuration
   */
  constructor(config = {}) {
    this.config = {
      boardSize: 10,
      numShips: 3,
      shipLength: 3,
      ...config
    };

    this.player = new Player(
      'Player',
      this.config.boardSize,
      this.config.numShips,
      this.config.shipLength
    );

    this.cpu = new Player(
      'CPU',
      this.config.boardSize,
      this.config.numShips,
      this.config.shipLength
    );

    this.ui = new GameUI();
  }

  /**
   * Initialize the game
   */
  initialize() {
    this.player.placeShipsRandomly();
    this.cpu.placeShipsRandomly();
    this.ui.displayMessage("\nLet's play Sea Battle!");
    this.ui.displayMessage(`Try to sink the ${this.config.numShips} enemy ships.`);
  }

  /**
   * Validate a player's guess
   * @param {string} guess - The guess to validate
   * @returns {boolean} Whether the guess is valid
   */
  validateGuess(guess) {
    if (!guess || guess.length !== 2) {
      this.ui.displayMessage('Oops, input must be exactly two digits (e.g., 00, 34, 98).');
      return false;
    }

    const [row, col] = guess.split('').map(Number);
    if (isNaN(row) || isNaN(col) || 
        row < 0 || row >= this.config.boardSize || 
        col < 0 || col >= this.config.boardSize) {
      this.ui.displayMessage(
        `Oops, please enter valid row and column numbers between 0 and ${this.config.boardSize - 1}.`
      );
      return false;
    }

    return true;
  }

  /**
   * Process a player's turn
   * @returns {Promise<boolean>} Whether the game should continue
   */
  async processPlayerTurn() {
    const guess = await this.ui.getPlayerGuess();
    
    // Проверяем, не было ли это место уже атаковано на доске CPU
    if (this.cpu.board.grid[guess[0]][guess[1]] === 'X' || this.cpu.board.grid[guess[0]][guess[1]] === 'O') {
      this.ui.displayMessage('This location was already targeted!');
      return true;
    }
    
    // Добавляем ход в список ходов игрока
    this.player.guesses.add(guess);
    
    // Обрабатываем ход на доске CPU
    const result = this.cpu.board.processGuess(guess);
    
    if (result) {
      this.ui.displayMessage(result.message);
      
      if (this.cpu.board.isAllShipsSunk()) {
        this.ui.displayMessage('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
        return false;
      }
      
      this.processCPUTurn();
    }
    
    return true;
  }

  /**
   * Process the CPU's turn
   * @returns {boolean} Whether the game should continue
   */
  processCPUTurn() {
    const guess = this.cpu.generateCPUGuess();
    
    // Проверяем, не было ли это место уже атаковано на доске игрока
    if (this.player.board.grid[guess[0]][guess[1]] === 'X' || this.player.board.grid[guess[0]][guess[1]] === 'O') {
      return this.processCPUTurn(); // Пробуем другой ход
    }
    
    const result = this.player.makeGuess(guess);
    
    this.ui.displayMessage('\n--- CPU\'s Turn ---');
    this.ui.displayMessage(`CPU targets: ${guess}`);
    this.ui.displayMessage(result.message);
    
    if (this.player.board.isAllShipsSunk()) {
      this.ui.displayMessage('\n*** GAME OVER! The CPU sunk all your battleships! ***');
      return false;
    }
    
    return true;
  }

  isGameOver() {
    return this.cpu.board.isAllShipsSunk() || this.player.board.isAllShipsSunk();
  }

  /**
   * Start the game loop
   */
  async start() {
    this.initialize();
    
    while (!this.isGameOver()) {
      this.ui.displayBoards(this.cpu.board.getState(false), this.player.board.getState(true));
      const continueGame = await this.processPlayerTurn();
      if (!continueGame) break;
    }

    this.ui.displayBoards(this.cpu.board.getState(), this.player.board.getState());
    this.ui.close();
  }
} 