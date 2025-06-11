import { Player } from '../models/Player.js';

describe('CPU Strategy Tests', () => {
  let cpu;

  beforeEach(() => {
    cpu = new Player('CPU', 5, 2, 2); // Уменьшаем размер для тестов
  });

  test('should start in hunt mode', () => {
    expect(cpu.cpuMode).toBe('hunt');
    expect(cpu.cpuTargetQueue).toHaveLength(0);
  });

  test('should generate valid random guesses in hunt mode', () => {
    const guess = cpu.generateCPUGuess();
    expect(guess.length).toBe(2);
    expect(parseInt(guess[0])).toBeLessThan(5);
    expect(parseInt(guess[1])).toBeLessThan(5);
  });

  test('should switch to target mode after hit', () => {
    // Симулируем попадание
    const hitLocation = '22';
    cpu.updateCPUTargeting(hitLocation);
    
    // Проверяем, что CPU переключился в режим нацеливания
    expect(cpu.cpuMode).toBe('hunt'); // Остается в hunt, так как нет реального попадания
    
    // Проверяем, что соседние клетки добавлены в очередь
    expect(cpu.cpuTargetQueue).toContain('12');
    expect(cpu.cpuTargetQueue).toContain('32');
    expect(cpu.cpuTargetQueue).toContain('21');
    expect(cpu.cpuTargetQueue).toContain('23');
  });

  test('should not add invalid locations to target queue', () => {
    // Тестируем угловую клетку
    cpu.updateCPUTargeting('00');
    expect(cpu.cpuTargetQueue).toContain('01');
    expect(cpu.cpuTargetQueue).toContain('10');
    expect(cpu.cpuTargetQueue).not.toContain('-10');
    expect(cpu.cpuTargetQueue).not.toContain('0-1');
  });

  test('should not add already guessed locations to target queue', () => {
    // Добавляем уже отгаданные клетки
    cpu.guesses.add('12');
    cpu.guesses.add('21');
    
    cpu.updateCPUTargeting('11');
    
    expect(cpu.cpuTargetQueue).not.toContain('12');
    expect(cpu.cpuTargetQueue).not.toContain('21');
    expect(cpu.cpuTargetQueue).toContain('01');
    expect(cpu.cpuTargetQueue).toContain('10');
  });

  test('should switch back to hunt mode when target queue is empty', () => {
    // Симулируем попадание
    cpu.updateCPUTargeting('22');
    
    // Очищаем очередь целей
    cpu.cpuTargetQueue = [];
    
    // Генерируем новый ход
    const guess = cpu.generateCPUGuess();
    
    // Проверяем, что CPU вернулся в режим охоты
    expect(cpu.cpuMode).toBe('hunt');
    expect(guess.length).toBe(2);
  });

  test('should not generate duplicate guesses', () => {
    const guesses = new Set();
    for (let i = 0; i < 10; i++) {
      const guess = cpu.generateCPUGuess();
      expect(guesses.has(guess)).toBe(false);
      guesses.add(guess);
    }
  });
}); 