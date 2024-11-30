const { validationResult } = require('express-validator');

/**
 * Formats validation errors into a standardized structure
 * @param {Object} errors - The validation errors object
 * @returns {Object} Formatted error object
 */
const formatValidationErrors = (errors) => {
  return {
    status: 'error',
    errors: errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }))
  };
};

/**
 * Checks for validation errors and returns formatted response if errors exist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean|Object} False if no errors, otherwise sends error response
 */
const checkValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(formatValidationErrors(errors));
    return true;
  }
  return false;
};

/**
 * Creates a validation chain with common validation rules
 * @param {Object} check - Express-validator check object
 * @param {string} fieldName - Name of the field to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation chain
 */
const createValidationChain = (check, fieldName, options = {}) => {
  const chain = check(fieldName);
  
  if (options.optional) {
    chain.optional();
  }
  
  if (options.trim) {
    chain.trim();
  }
  
  if (options.minLength) {
    chain.isLength({ min: options.minLength })
      .withMessage(`${fieldName} must be at least ${options.minLength} characters long`);
  }
  
  return chain;
};

module.exports = {
  formatValidationErrors,
  checkValidationErrors,
  createValidationChain
};