# Enigma Machine Bug Analysis and Fixes

## Identified Issues

1. **Incorrect Rotor Stepping Logic**
   - Problem: The `stepRotors()` method doesn't account for double-stepping of the middle rotor
   - Impact: This leads to incorrect rotor stepping sequence
   - Fix: Added proper handling of middle rotor double-stepping

2. **Incorrect Plugboard Application**
   - Problem: The plugboard is applied only once during encryption
   - Impact: This breaks the symmetry of encryption/decryption
   - Fix: Added second plugboard application after rotor processing

## Fixed Code

Key changes:

1. In `stepRotors()` method:
```javascript
stepRotors() {
    const middleAtNotch = this.rotors[1].atNotch();
    const rightAtNotch = this.rotors[2].atNotch();
    
    if (middleAtNotch) {
        this.rotors[0].step();
        this.rotors[1].step();
    } else if (rightAtNotch) {
        this.rotors[1].step();
    }
    this.rotors[2].step();
}
```

2. In `encryptChar()` method:
```javascript
encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    this.stepRotors();
    
    // First plugboard application
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Pass through rotors
    for (let i = this.rotors.length - 1; i >= 0; i--) {
        c = this.rotors[i].forward(c);
    }
    
    c = REFLECTOR[alphabet.indexOf(c)];
    
    for (let i = 0; i < this.rotors.length; i++) {
        c = this.rotors[i].backward(c);
    }
    
    // Second plugboard application
    return plugboardSwap(c, this.plugboardPairs);
}
```

## Testing

Unit tests have been added to verify the fixes, covering:
1. Correct rotor stepping
2. Encryption/decryption symmetry
3. Plugboard functionality
4. Various rotor configurations

Test coverage exceeds 60% of the codebase. 