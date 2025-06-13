const BaseValidator = require('./BaseValidator');

/**
 * Validator for number values
 */
class NumberValidator extends BaseValidator {
  constructor() {
    super();
    this.addRule(
      value => typeof value === 'number' && !isNaN(value),
      'Value must be a valid number'
    );
  }

  /**
   * Add minimum value validation
   * @param {number} min - Minimum value
   * @returns {NumberValidator} - Returns this for chaining
   */
  min(min) {
    this.addRule(
      value => value >= min,
      `Number must be greater than or equal to ${min}`
    );
    return this;
  }

  /**
   * Add maximum value validation
   * @param {number} max - Maximum value
   * @returns {NumberValidator} - Returns this for chaining
   */
  max(max) {
    this.addRule(
      value => value <= max,
      `Number must be less than or equal to ${max}`
    );
    return this;
  }

  /**
   * Add integer validation
   * @returns {NumberValidator} - Returns this for chaining
   */
  integer() {
    this.addRule(
      value => Number.isInteger(value),
      'Number must be an integer'
    );
    return this;
  }

  /**
   * Add positive number validation
   * @returns {NumberValidator} - Returns this for chaining
   */
  positive() {
    this.addRule(
      value => value > 0,
      'Number must be positive'
    );
    return this;
  }
}

module.exports = NumberValidator; 