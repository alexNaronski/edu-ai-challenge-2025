const BaseValidator = require('./BaseValidator');

/**
 * Validator for boolean values
 */
class BooleanValidator extends BaseValidator {
  constructor() {
    super();
    this.addRule(
      value => typeof value === 'boolean',
      'Value must be a boolean'
    );
  }

  /**
   * Add required validation
   * @returns {BooleanValidator} - Returns this for chaining
   */
  required() {
    this.addRule(
      value => value === true,
      'Boolean must be true'
    );
    return this;
  }
}

module.exports = BooleanValidator; 