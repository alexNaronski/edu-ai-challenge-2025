const Schema = require('../src/Schema');

describe('Schema', () => {
  describe('string()', () => {
    it('should validate string values', () => {
      const validator = Schema.string();
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate(123).isValid).toBe(false);
    });

    it('should validate string length', () => {
      const validator = Schema.string().minLength(2).maxLength(4);
      expect(validator.validate('ab').isValid).toBe(true);
      expect(validator.validate('a').isValid).toBe(false);
      expect(validator.validate('abcde').isValid).toBe(false);
    });

    it('should validate email pattern', () => {
      const validator = Schema.string().email();
      expect(validator.validate('test@example.com').isValid).toBe(true);
      expect(validator.validate('invalid-email').isValid).toBe(false);
    });
  });

  describe('number()', () => {
    it('should validate number values', () => {
      const validator = Schema.number();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate('123').isValid).toBe(false);
    });

    it('should validate number range', () => {
      const validator = Schema.number().min(1).max(10);
      expect(validator.validate(5).isValid).toBe(true);
      expect(validator.validate(0).isValid).toBe(false);
      expect(validator.validate(11).isValid).toBe(false);
    });

    it('should validate integer values', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate(123.45).isValid).toBe(false);
    });
  });

  describe('boolean()', () => {
    it('should validate boolean values', () => {
      const validator = Schema.boolean();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
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
    });

    it('should validate array length', () => {
      const validator = Schema.array(Schema.string()).minLength(2).maxLength(4);
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a']).isValid).toBe(false);
      expect(validator.validate(['a', 'b', 'c', 'd', 'e']).isValid).toBe(false);
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
    });
  });
}); 