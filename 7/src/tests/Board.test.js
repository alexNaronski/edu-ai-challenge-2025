import { Board } from '../models/Board.js';
import { Ship } from '../models/Ship.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(5);
  });

  test('should create a board with correct size', () => {
    expect(board.size).toBe(5);
    expect(board.grid.length).toBe(5);
    expect(board.grid[0].length).toBe(5);
    expect(board.grid[0][0]).toBe('~');
  });

  test('should place a ship correctly', () => {
    const ship = new Ship(3);
    ship.locations = ['00', '01', '02'];
    
    board.placeShip(ship);
    
    expect(board.grid[0][0]).toBe('S');
    expect(board.grid[0][1]).toBe('S');
    expect(board.grid[0][2]).toBe('S');
    expect(board.ships).toContainEqual(ship);
  });

  test('should process a hit correctly', () => {
    const ship = new Ship(3);
    ship.locations = ['00', '01', '02'];
    board.placeShip(ship);

    const result = board.processGuess('00');
    expect(result.hit).toBe(true);
    expect(result.message).toBe('Hit!');
    expect(board.grid[0][0]).toBe('X');
  });

  test('should process a miss correctly', () => {
    const result = board.processGuess('00');
    expect(result.hit).toBe(false);
    expect(result.message).toBe('Miss!');
    expect(board.grid[0][0]).toBe('O');
  });

  test('should detect when all ships are sunk', () => {
    const ship = new Ship(3);
    ship.locations = ['00', '01', '02'];
    board.placeShip(ship);

    board.processGuess('00');
    board.processGuess('01');
    board.processGuess('02');
    
    expect(board.isAllShipsSunk()).toBe(true);
  });

  test('should not allow hitting the same location twice', () => {
    const ship = new Ship(3);
    ship.locations = ['00', '01', '02'];
    board.placeShip(ship);

    board.processGuess('00');
    const result = board.processGuess('00');
    
    expect(result.hit).toBe(false);
    expect(result.message).toBe('You already guessed that location!');
  });
}); 