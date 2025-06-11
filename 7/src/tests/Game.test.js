import { jest } from '@jest/globals';
import { Game } from '../Game.js';
import { Player } from '../models/Player.js';
import { Ship } from '../models/Ship.js';

describe('Game Integration Tests', () => {
  let game;

  beforeEach(() => {
    game = new Game({
      boardSize: 5, // Уменьшаем размер для тестов
      numShips: 2,
      shipLength: 2
    });
  });

  test('should initialize game correctly', () => {
    expect(game.player).toBeInstanceOf(Player);
    expect(game.cpu).toBeInstanceOf(Player);
    expect(game.player.board.grid.length).toBe(5);
    expect(game.cpu.board.grid.length).toBe(5);
  });

  test('should validate player guesses correctly', () => {
    expect(game.validateGuess('00')).toBe(true);
    expect(game.validateGuess('44')).toBe(true);
    expect(game.validateGuess('55')).toBe(false); // Вне поля
    expect(game.validateGuess('0')).toBe(false); // Неверный формат
    expect(game.validateGuess('abc')).toBe(false); // Неверный формат
  });

  test('should process player turn correctly', async () => {
    const mockGuess = '00';
    game.ui.getPlayerGuess = jest.fn().mockResolvedValue(mockGuess);

    const ship = new Ship(2);
    ship.locations = ['00', '01'];
    game.cpu.board.ships.push(ship);

    await game.processPlayerTurn();
    expect(game.player.guesses.has(mockGuess)).toBe(true);
  });

  test('should process CPU turn correctly', () => {
    const ship = new Ship(2);
    ship.locations = ['00', '01'];
    game.player.board.ships.push(ship);

    game.processCPUTurn();
    expect(game.cpu.guesses.size).toBe(1);
  });

  test('should detect game over conditions', async () => {
    game.ui.getPlayerGuess = jest.fn().mockResolvedValue('00');
    
    const ship = new Ship(2);
    ship.locations = ['00', '01'];
    ship.hits = ['hit', 'hit'];
    game.cpu.board.ships.push(ship);

    await game.processPlayerTurn();
    expect(game.isGameOver()).toBe(true);
  });
}); 