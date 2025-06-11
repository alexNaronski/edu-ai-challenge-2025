import { Game } from '../Game.js';
import { Player } from '../models/Player.js';

describe('Game Integration Tests', () => {
  let game;

  beforeEach(() => {
    game = new Game({
      boardSize: 5, // Уменьшаем размер для тестов
      numShips: 2,
      shipLength: 2
    });
  });

  test('should initialize game with correct configuration', () => {
    expect(game.config.boardSize).toBe(5);
    expect(game.config.numShips).toBe(2);
    expect(game.config.shipLength).toBe(2);
    expect(game.player).toBeInstanceOf(Player);
    expect(game.cpu).toBeInstanceOf(Player);
  });

  test('should validate player guesses correctly', () => {
    expect(game.validateGuess('00')).toBe(true);
    expect(game.validateGuess('44')).toBe(true);
    expect(game.validateGuess('55')).toBe(false); // Вне поля
    expect(game.validateGuess('0')).toBe(false); // Неверный формат
    expect(game.validateGuess('abc')).toBe(false); // Неверный формат
  });

  test('should process player turn correctly', async () => {
    // Мокаем UI для тестирования
    const mockGuess = '00';
    game.ui.getPlayerGuess = jest.fn().mockResolvedValue(mockGuess);
    
    // Размещаем корабль CPU в известном месте для теста
    const ship = { locations: ['00', '01'], hits: ['', ''] };
    game.cpu.board.ships = [ship];
    
    const result = await game.processPlayerTurn();
    expect(result).toBe(true);
    expect(game.cpu.board.grid[0][0]).toBe('X');
  });

  test('should process CPU turn correctly', () => {
    // Размещаем корабль игрока в известном месте для теста
    const ship = { locations: ['00', '01'], hits: ['', ''] };
    game.player.board.ships = [ship];
    
    const result = game.processCPUTurn();
    expect(result).toBe(true);
  });

  test('should detect game over conditions', async () => {
    // Мокаем UI
    game.ui.getPlayerGuess = jest.fn().mockResolvedValue('00');
    
    // Размещаем один корабль CPU и топим его
    const ship = { locations: ['00', '01'], hits: ['hit', 'hit'] };
    game.cpu.board.ships = [ship];
    
    const result = await game.processPlayerTurn();
    expect(result).toBe(false); // Игра должна закончиться
  });
}); 