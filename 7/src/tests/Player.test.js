import { Player } from '../models/Player.js';

describe('Player', () => {
  let player;
  let cpu;

  beforeEach(() => {
    player = new Player('Player', 10, 3, 3);
    cpu = new Player('CPU', 10, 3, 3);
  });

  test('should create a player with correct properties', () => {
    expect(player.name).toBe('Player');
    expect(player.board.size).toBe(10);
    expect(player.numShips).toBe(3);
    expect(player.shipLength).toBe(3);
    expect(player.isCPU).toBe(false);
  });

  test('should create a CPU player with correct properties', () => {
    expect(cpu.name).toBe('CPU');
    expect(cpu.isCPU).toBe(true);
    expect(cpu.cpuMode).toBe('hunt');
  });

  test('should place ships randomly', () => {
    player.placeShipsRandomly();
    expect(player.board.ships.length).toBe(3);
  });

  test('should make a valid guess', () => {
    const result = player.makeGuess('00');
    expect(result.valid).toBe(true);
    expect(player.guesses.has('00')).toBe(true);
  });

  test('should not allow duplicate guesses', () => {
    player.makeGuess('00');
    const result = player.makeGuess('00');
    expect(result.valid).toBe(false);
  });

  test('should generate CPU guesses', () => {
    const guess = cpu.generateCPUGuess();
    expect(guess.length).toBe(2);
    expect(cpu.guesses.has(guess)).toBe(true);
  });

  test('should update CPU targeting after a hit', () => {
    cpu.updateCPUTargeting('55');
    expect(cpu.cpuTargetQueue.length).toBe(4);
    expect(cpu.cpuTargetQueue).toContain('45');
    expect(cpu.cpuTargetQueue).toContain('65');
    expect(cpu.cpuTargetQueue).toContain('54');
    expect(cpu.cpuTargetQueue).toContain('56');
  });

  test('should switch CPU mode to target after a hit', () => {
    cpu.cpuMode = 'hunt';
    cpu.updateCPUTargeting('55');
    expect(cpu.cpuMode).toBe('hunt');
  });
}); 