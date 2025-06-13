const StringValidator = require('./validators/StringValidator');
const NumberValidator = require('./validators/NumberValidator');
const BooleanValidator = require('./validators/BooleanValidator');
const ArrayValidator = require('./validators/ArrayValidator');
const ObjectValidator = require('./validators/ObjectValidator');

/**
 * Main Schema class for creating validators
 */
class Schema {
  /**
   * Create a string validator
   * @returns {StringValidator}
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Create a number validator
   * @returns {NumberValidator}
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Create a boolean validator
   * @returns {BooleanValidator}
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Create an object validator
   * @param {Object} schema - Object schema with validators
   * @returns {ObjectValidator}
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Create an array validator
   * @param {BaseValidator} itemValidator - Validator for array items
   * @returns {ArrayValidator}
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

module.exports = Schema; 