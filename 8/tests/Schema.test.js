const Schema = require('../src/Schema');

describe('Schema', () => {
  describe('string()', () => {
    it('should validate string values', () => {
      const validator = Schema.string();
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate(123).isValid).toBe(false);
      expect(validator.validate(null).isValid).toBe(false);
      expect(validator.validate(undefined).isValid).toBe(false);
      expect(validator.validate('').isValid).toBe(true);
    });

    it('should validate string length', () => {
      const validator = Schema.string().minLength(2).maxLength(4);
      expect(validator.validate('ab').isValid).toBe(true);
      expect(validator.validate('a').isValid).toBe(false);
      expect(validator.validate('abcde').isValid).toBe(false);
      expect(validator.validate('').isValid).toBe(false);
      expect(validator.validate('   ').isValid).toBe(true);
    });

    it('should validate email pattern', () => {
      const validator = Schema.string().email();
      expect(validator.validate('test@example.com').isValid).toBe(true);
      expect(validator.validate('invalid-email').isValid).toBe(false);
      expect(validator.validate('test@.com').isValid).toBe(false);
      expect(validator.validate('@example.com').isValid).toBe(false);
      expect(validator.validate('test@example').isValid).toBe(false);
      expect(validator.validate('test@example.c').isValid).toBe(false);
      expect(validator.validate('test@example.co.uk').isValid).toBe(true);
      expect(validator.validate('test.name@example.com').isValid).toBe(true);
      expect(validator.validate('test+name@example.com').isValid).toBe(true);
    });

    it('should validate custom patterns', () => {
      const validator = Schema.string().pattern(/^[A-Z][a-z]+$/);
      expect(validator.validate('John').isValid).toBe(true);
      expect(validator.validate('john').isValid).toBe(false);
      expect(validator.validate('JOHN').isValid).toBe(false);
      expect(validator.validate('John123').isValid).toBe(false);
    });
  });

  describe('number()', () => {
    it('should validate number values', () => {
      const validator = Schema.number();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate('123').isValid).toBe(false);
      expect(validator.validate(null).isValid).toBe(false);
      expect(validator.validate(undefined).isValid).toBe(false);
      expect(validator.validate(NaN).isValid).toBe(false);
      expect(validator.validate(Infinity).isValid).toBe(true);
    });

    it('should validate number range', () => {
      const validator = Schema.number().min(1).max(10);
      expect(validator.validate(5).isValid).toBe(true);
      expect(validator.validate(0).isValid).toBe(false);
      expect(validator.validate(11).isValid).toBe(false);
      expect(validator.validate(1).isValid).toBe(true);
      expect(validator.validate(10).isValid).toBe(true);
    });

    it('should validate integer values', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate(123.45).isValid).toBe(false);
      expect(validator.validate(-123).isValid).toBe(true);
      expect(validator.validate(0).isValid).toBe(true);
    });

    it('should validate positive numbers', () => {
      const validator = Schema.number().positive();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate(-123).isValid).toBe(false);
      expect(validator.validate(0).isValid).toBe(false);
      expect(validator.validate(0.1).isValid).toBe(true);
    });
  });

  describe('boolean()', () => {
    it('should validate boolean values', () => {
      const validator = Schema.boolean();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
      expect(validator.validate(1).isValid).toBe(false);
      expect(validator.validate(null).isValid).toBe(false);
      expect(validator.validate(undefined).isValid).toBe(false);
    });

    it('should validate required boolean', () => {
      const validator = Schema.boolean().required();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(false);
    });
  });

  describe('array()', () => {
    it('should validate array values', () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate([1, 2]).isValid).toBe(false);
      expect(validator.validate([]).isValid).toBe(true);
      expect(validator.validate(null).isValid).toBe(false);
      expect(validator.validate(undefined).isValid).toBe(false);
      expect(validator.validate('not-an-array').isValid).toBe(false);
    });

    it('should validate array length', () => {
      const validator = Schema.array(Schema.string()).minLength(2).maxLength(4);
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a']).isValid).toBe(false);
      expect(validator.validate(['a', 'b', 'c', 'd', 'e']).isValid).toBe(false);
      expect(validator.validate([]).isValid).toBe(false);
    });

    it('should validate array items', () => {
      const validator = Schema.array(Schema.number().min(0).max(100));
      expect(validator.validate([1, 50, 99]).isValid).toBe(true);
      expect(validator.validate([-1, 50, 101]).isValid).toBe(false);
      expect(validator.validate([1, '50', 99]).isValid).toBe(false);
    });

    it('should validate nested arrays', () => {
      const validator = Schema.array(Schema.array(Schema.number()));
      expect(validator.validate([[1, 2], [3, 4]]).isValid).toBe(true);
      expect(validator.validate([[1, '2'], [3, 4]]).isValid).toBe(false);
      expect(validator.validate([1, 2, 3]).isValid).toBe(false);
    });
  });

  describe('object()', () => {
    it('should validate object values', () => {
      const validator = Schema.object({
        name: Schema.string(),
        age: Schema.number()
      });

      expect(validator.validate({
        name: 'John',
        age: 30
      }).isValid).toBe(true);

      expect(validator.validate({
        name: 'John',
        age: '30'
      }).isValid).toBe(false);

      expect(validator.validate({
        name: 'John'
      }).isValid).toBe(false);

      expect(validator.validate(null).isValid).toBe(false);
      expect(validator.validate(undefined).isValid).toBe(false);
      expect(validator.validate('not-an-object').isValid).toBe(false);
    });

    it('should validate nested objects', () => {
      const validator = Schema.object({
        user: Schema.object({
          name: Schema.string(),
          age: Schema.number()
        })
      });

      expect(validator.validate({
        user: {
          name: 'John',
          age: 30
        }
      }).isValid).toBe(true);

      expect(validator.validate({
        user: {
          name: 'John',
          age: '30'
        }
      }).isValid).toBe(false);

      expect(validator.validate({
        user: null
      }).isValid).toBe(false);
    });

    it('should validate complex nested structures', () => {
      const validator = Schema.object({
        user: Schema.object({
          name: Schema.string().minLength(2),
          age: Schema.number().min(0),
          addresses: Schema.array(Schema.object({
            street: Schema.string(),
            city: Schema.string(),
            postalCode: Schema.string().pattern(/^\d{5}$/)
          }))
        })
      });

      expect(validator.validate({
        user: {
          name: 'John',
          age: 30,
          addresses: [
            {
              street: '123 Main St',
              city: 'Anytown',
              postalCode: '12345'
            }
          ]
        }
      }).isValid).toBe(true);

      expect(validator.validate({
        user: {
          name: 'J',
          age: -1,
          addresses: [
            {
              street: '123 Main St',
              city: 'Anytown',
              postalCode: '123'
            }
          ]
        }
      }).isValid).toBe(false);
    });
  });
}); 