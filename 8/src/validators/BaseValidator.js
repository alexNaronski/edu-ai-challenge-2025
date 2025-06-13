/**
 * Base validator class that all other validators will extend
 */
class BaseValidator {
  constructor() {
    this.rules = [];
    this.customMessage = null;
  }

  /**
   * Add a validation rule
   * @param {Function} rule - Validation function that returns boolean
   * @param {string} message - Error message if validation fails
   * @returns {BaseValidator} - Returns this for chaining
   */
  addRule(rule, message) {
    this.rules.push({ rule, message });
    return this;
  }

  /**
   * Set custom error message
   * @param {string} message - Custom error message
   * @returns {BaseValidator} - Returns this for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Validate a value against all rules
   * @param {any} value - Value to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  validate(value) {
    const errors = [];
    
    for (const { rule, message } of this.rules) {
      if (!rule(value)) {
        errors.push(this.customMessage || message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = BaseValidator; 