import { Ship } from '../models/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3, ['00', '01', '02']);
  });

  test('should create a ship with correct length and locations', () => {
    expect(ship.length).toBe(3);
    expect(ship.locations).toEqual(['00', '01', '02']);
    expect(ship.hits).toEqual(['', '', '']);
  });

  test('should not be sunk initially', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('should be sunk when all parts are hit', () => {
    ship.processHit('00');
    ship.processHit('01');
    ship.processHit('02');
    expect(ship.isSunk()).toBe(true);
  });

  test('should process hits correctly', () => {
    expect(ship.processHit('00')).toBe(true);
    expect(ship.hits[0]).toBe('hit');
    expect(ship.processHit('00')).toBe(false);
  });

  test('should check if location is part of ship', () => {
    expect(ship.hasLocation('00')).toBe(true);
    expect(ship.hasLocation('11')).toBe(false);
  });
}); 