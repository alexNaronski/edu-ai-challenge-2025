const { Enigma, Rotor, ROTORS, REFLECTOR, plugboardSwap } = require('./enigma');

describe('Enigma Machine Tests', () => {
  // Basic encryption test
  test('Basic encryption works correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = 'HELLO';
    const encrypted = enigma.process(message);
    expect(encrypted).toBeDefined();
    expect(encrypted.length).toBe(message.length);
  });

  // Encryption/decryption symmetry test
  test('Encryption is symmetric', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = 'HELLO';
    
    const encrypted = enigma1.process(message);
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  // Plugboard functionality test
  test('Plugboard works correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    // Check that A and B are swapped
    expect(encrypted.includes('A')).toBe(false);
    expect(encrypted.includes('B')).toBe(true);
  });

  // Rotor stepping test
  test('Rotor stepping works correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = 'A'.repeat(27); // Long enough message to test stepping
    
    const encrypted = enigma.process(message);
    expect(encrypted.length).toBe(message.length);
    
    // Check that each character is encrypted differently
    const uniqueChars = new Set(encrypted.split(''));
    expect(uniqueChars.size).toBeGreaterThan(1);
  });

  // Different rotor settings test
  test('Different rotor settings work correctly', () => {
    const enigma1 = new Enigma([0, 1, 2], [1, 2, 3], [1, 2, 3], []);
    const enigma2 = new Enigma([0, 1, 2], [1, 2, 3], [1, 2, 3], []);
    const message = 'HELLO';
    
    const encrypted = enigma1.process(message);
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(message);
  });

  // Non-alphabetic characters test
  test('Non-alphabetic characters are preserved', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = 'HELLO 123!';
    const encrypted = enigma.process(message);
    
    expect(encrypted).toMatch(/[A-Z]+\s\d+!/);
  });

  // Empty string test
  test('Empty string handling', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const message = '';
    const encrypted = enigma.process(message);
    
    expect(encrypted).toBe('');
  });

  // Different rotor combinations test
  test('Different rotor combinations work correctly', () => {
    const enigma = new Enigma([2, 1, 0], [0, 0, 0], [0, 0, 0], []);
    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    expect(encrypted).toBeDefined();
    expect(encrypted.length).toBe(message.length);
  });
}); 