const BaseValidator = require('./BaseValidator');

/**
 * Validator for array values
 */
class ArrayValidator extends BaseValidator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    
    this.addRule(
      value => Array.isArray(value),
      'Value must be an array'
    );
  }

  /**
   * Add minimum length validation
   * @param {number} length - Minimum length
   * @returns {ArrayValidator} - Returns this for chaining
   */
  minLength(length) {
    this.addRule(
      value => value.length >= length,
      `Array must have at least ${length} items`
    );
    return this;
  }

  /**
   * Add maximum length validation
   * @param {number} length - Maximum length
   * @returns {ArrayValidator} - Returns this for chaining
   */
  maxLength(length) {
    this.addRule(
      value => value.length <= length,
      `Array must have at most ${length} items`
    );
    return this;
  }

  /**
   * Validate array items
   * @param {any} value - Value to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  validate(value) {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const errors = [];
    for (let i = 0; i < value.length; i++) {
      const itemResult = this.itemValidator.validate(value[i]);
      if (!itemResult.isValid) {
        errors.push(`Item at index ${i}: ${itemResult.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ArrayValidator; 