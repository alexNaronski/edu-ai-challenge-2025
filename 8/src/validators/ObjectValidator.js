const BaseValidator = require('./BaseValidator');

/**
 * Validator for object values
 */
class ObjectValidator extends BaseValidator {
  constructor(schema) {
    super();
    this.schema = schema;
    
    this.addRule(
      value => typeof value === 'object' && value !== null && !Array.isArray(value),
      'Value must be an object'
    );
  }

  /**
   * Validate object properties
   * @param {Object} value - Value to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  validate(value) {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const errors = [];
    for (const [key, validator] of Object.entries(this.schema)) {
      if (value[key] === undefined) {
        if (!validator.optional) {
          errors.push(`Missing required property: ${key}`);
        }
        continue;
      }

      const result = validator.validate(value[key]);
      if (!result.isValid) {
        errors.push(`${key}: ${result.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ObjectValidator; 