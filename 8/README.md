# Validation Library

A robust validation library for complex data structures in JavaScript. This library provides a fluent API for validating data with support for primitive types, arrays, and nested objects.

## Features

- 🔍 Type-safe validation for primitive types (string, number, boolean)
- 📦 Support for complex types (arrays, objects)
- 🔄 Fluent API for chaining validation rules
- 🎯 Custom validation rules and error messages
- 📝 Comprehensive error reporting
- 🧪 Extensive test coverage

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd 8

# Install dependencies
npm install
```

## Quick Start

```javascript
const Schema = require('./src/Schema');

// Create a simple validator
const nameValidator = Schema.string()
  .minLength(2)
  .maxLength(50);

// Validate a value
const result = nameValidator.validate('John');
console.log(result.isValid); // true
console.log(result.errors); // []

// Invalid value
const invalidResult = nameValidator.validate('J');
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors); // ['String must be at least 2 characters long']
```

## Advanced Usage

### Complex Object Validation

```javascript
const userSchema = Schema.object({
  // Basic fields
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).max(120),
  isActive: Schema.boolean(),

  // Array of strings
  tags: Schema.array(Schema.string()).minLength(1),

  // Nested object
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/)
  }),

  // Optional fields
  metadata: Schema.object({}).optional()
});

// Valid data
const validUser = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  tags: ['developer', 'designer'],
  address: {
    street: '123 Main St',
    city: 'Anytown',
    postalCode: '12345'
  }
};

// Invalid data
const invalidUser = {
  name: 'J', // Too short
  email: 'invalid-email',
  age: 150, // Too old
  isActive: 'true', // Not a boolean
  tags: [], // Empty array
  address: {
    street: '123 Main St',
    city: 'Anytown',
    postalCode: '123' // Invalid postal code
  }
};

const result = userSchema.validate(validUser);
console.log(result.isValid); // true

const invalidResult = userSchema.validate(invalidUser);
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors);
// [
//   'name: String must be at least 2 characters long',
//   'email: String does not match required pattern',
//   'age: Number must be less than or equal to 120',
//   'isActive: Value must be a boolean',
//   'tags: Array must have at least 1 items',
//   'address.postalCode: String does not match required pattern'
// ]
```

### Custom Validation Rules

```javascript
// Custom string pattern
const usernameValidator = Schema.string()
  .pattern(/^[a-zA-Z0-9_]{3,20}$/)
  .withMessage('Username must be 3-20 characters long and contain only letters, numbers, and underscores');

// Custom number range
const scoreValidator = Schema.number()
  .min(0)
  .max(100)
  .withMessage('Score must be between 0 and 100');

// Custom array validation
const uniqueTagsValidator = Schema.array(Schema.string())
  .minLength(1)
  .maxLength(5)
  .withMessage('Must have 1-5 unique tags');
```

### Error Handling

```javascript
try {
  const result = validator.validate(data);
  if (!result.isValid) {
    // Handle validation errors
    console.error('Validation failed:', result.errors);
    return;
  }
  // Process valid data
} catch (error) {
  // Handle unexpected errors
  console.error('Validation error:', error);
}
```

## Available Validators

### String Validator
```javascript
Schema.string()
  .minLength(2) // Minimum length
  .maxLength(50) // Maximum length
  .pattern(/^[a-z]+$/) // Custom pattern
  .email() // Email validation
  .withMessage('Custom error message') // Custom error message
```

### Number Validator
```javascript
Schema.number()
  .min(0) // Minimum value
  .max(100) // Maximum value
  .integer() // Integer validation
  .positive() // Positive number validation
  .withMessage('Custom error message')
```

### Boolean Validator
```javascript
Schema.boolean()
  .required() // Must be true
  .withMessage('Custom error message')
```

### Array Validator
```javascript
Schema.array(Schema.string())
  .minLength(1) // Minimum array length
  .maxLength(10) // Maximum array length
  .withMessage('Custom error message')
```

### Object Validator
```javascript
Schema.object({
  name: Schema.string(),
  age: Schema.number()
})
  .withMessage('Custom error message')
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

The test coverage report will be generated in the `coverage` directory and will show:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage
- Uncovered lines

### Project Structure

```
validation-library/
├── src/
│   ├── Schema.js
│   └── validators/
│       ├── BaseValidator.js
│       ├── StringValidator.js
│       ├── NumberValidator.js
│       ├── BooleanValidator.js
│       ├── ArrayValidator.js
│       └── ObjectValidator.js
├── tests/
│   └── Schema.test.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT 