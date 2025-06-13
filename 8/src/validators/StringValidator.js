const BaseValidator = require('./BaseValidator');

/**
 * Validator for string values
 */
class StringValidator extends BaseValidator {
  constructor() {
    super();
    this.addRule(
      value => typeof value === 'string',
      'Value must be a string'
    );
  }

  /**
   * Add minimum length validation
   * @param {number} length - Minimum length
   * @returns {StringValidator} - Returns this for chaining
   */
  minLength(length) {
    this.addRule(
      value => value.length >= length,
      `String must be at least ${length} characters long`
    );
    return this;
  }

  /**
   * Add maximum length validation
   * @param {number} length - Maximum length
   * @returns {StringValidator} - Returns this for chaining
   */
  maxLength(length) {
    this.addRule(
      value => value.length <= length,
      `String must be at most ${length} characters long`
    );
    return this;
  }

  /**
   * Add pattern validation
   * @param {RegExp} pattern - Regular expression pattern
   * @returns {StringValidator} - Returns this for chaining
   */
  pattern(pattern) {
    this.addRule(
      value => pattern.test(value),
      'String does not match required pattern'
    );
    return this;
  }

  /**
   * Add email validation
   * @returns {StringValidator} - Returns this for chaining
   */
  email() {
    return this.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  }
}

module.exports = StringValidator; 