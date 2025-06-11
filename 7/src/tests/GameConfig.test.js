import { Game } from '../Game.js';
import { Player } from '../models/Player.js';

describe('Game Configuration Tests', () => {
  test('should create game with default configuration', () => {
    const game = new Game();
    expect(game.config.boardSize).toBe(10);
    expect(game.config.numShips).toBe(3);
    expect(game.config.shipLength).toBe(3);
  });

  test('should create game with custom configuration', () => {
    const config = {
      boardSize: 8,
      numShips: 4,
      shipLength: 2
    };
    const game = new Game(config);
    expect(game.config.boardSize).toBe(8);
    expect(game.config.numShips).toBe(4);
    expect(game.config.shipLength).toBe(2);
  });

  test('should place correct number of ships with custom configuration', () => {
    const config = {
      boardSize: 5,
      numShips: 2,
      shipLength: 2
    };
    const game = new Game(config);
    game.initialize();
    expect(game.player.board.ships.length).toBe(2);
    expect(game.cpu.board.ships.length).toBe(2);
  });

  test('should validate guesses according to board size', () => {
    const config = {
      boardSize: 5,
      numShips: 2,
      shipLength: 2
    };
    const game = new Game(config);
    
    // Валидные ходы
    expect(game.validateGuess('00')).toBe(true);
    expect(game.validateGuess('44')).toBe(true);
    
    // Невалидные ходы
    expect(game.validateGuess('55')).toBe(false);
    expect(game.validateGuess('50')).toBe(false);
    expect(game.validateGuess('05')).toBe(false);
  });

  test('should handle different ship lengths', () => {
    const config = {
      boardSize: 5,
      numShips: 1,
      shipLength: 4
    };
    const game = new Game(config);
    game.initialize();
    
    // Проверяем, что корабль имеет правильную длину
    expect(game.player.board.ships[0].length).toBe(4);
    expect(game.player.board.ships[0].locations.length).toBe(4);
  });

  test('should handle maximum possible ships', () => {
    const config = {
      boardSize: 5,
      numShips: 5,
      shipLength: 1
    };
    const game = new Game(config);
    game.initialize();
    
    // Проверяем, что все корабли размещены
    expect(game.player.board.ships.length).toBe(5);
    expect(game.cpu.board.ships.length).toBe(5);
  });

  test('should handle minimum board size', () => {
    const config = {
      boardSize: 3,
      numShips: 1,
      shipLength: 2
    };
    const game = new Game(config);
    game.initialize();
    
    // Проверяем размер доски
    expect(game.player.board.size).toBe(3);
    expect(game.player.board.grid.length).toBe(3);
    expect(game.player.board.grid[0].length).toBe(3);
  });

  test('should handle edge cases in configuration', () => {
    // Тестируем минимальные значения
    const minConfig = {
      boardSize: 2,
      numShips: 1,
      shipLength: 1
    };
    const minGame = new Game(minConfig);
    minGame.initialize();
    expect(minGame.player.board.ships.length).toBe(1);
    
    // Тестируем максимальные значения
    const maxConfig = {
      boardSize: 10,
      numShips: 10,
      shipLength: 1
    };
    const maxGame = new Game(maxConfig);
    maxGame.initialize();
    expect(maxGame.player.board.ships.length).toBe(10);
  });
}); 