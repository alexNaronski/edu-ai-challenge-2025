# Validation Library

A robust validation library for complex data structures in JavaScript.

## Installation

```bash
npm install
```

## Usage

```javascript
const Schema = require('./src/Schema');

// Create a schema for a user object
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).max(120),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()).minLength(1),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/)
  })
});

// Validate data
const data = {
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

const result = userSchema.validate(data);
console.log(result.isValid); // true
console.log(result.errors); // []

// Invalid data
const invalidData = {
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

const invalidResult = userSchema.validate(invalidData);
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors); // Array of error messages
```

## Available Validators

### String Validator
```javascript
Schema.string()
  .minLength(2)
  .maxLength(50)
  .pattern(/^[a-z]+$/)
  .email()
```

### Number Validator
```javascript
Schema.number()
  .min(0)
  .max(100)
  .integer()
  .positive()
```

### Boolean Validator
```javascript
Schema.boolean()
  .required()
```

### Array Validator
```javascript
Schema.array(Schema.string())
  .minLength(1)
  .maxLength(10)
```

### Object Validator
```javascript
Schema.object({
  name: Schema.string(),
  age: Schema.number()
})
```

## Running Tests

```bash
npm test
```

## Test Coverage

```bash
npm test -- --coverage
```

## License

MIT 