import { Schema as S } from '@effect/schema'
import { describe, expect, it } from 'vitest'
import { ValidationError, toValidate, toValidationSchema } from './index'

describe('validation functions', () => {
  // Define a sample schema for testing
  const TestSchema = S.Struct({
    name: S.String,
    age: S.Number,
    email: S.String.pipe(S.pattern(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/)),
  })

  describe('toValidationSchema', () => {
    it('should validate correct data without throwing', async () => {
      const validationSchema = toValidationSchema(TestSchema)
      const validData = { name: 'John Doe', age: 30, email: 'john@example.com' }

      await expect(validationSchema.validate(validData)).resolves.toBeUndefined()
    })

    it('should throw ValidationError for invalid data', async () => {
      const validationSchema = toValidationSchema(TestSchema)
      const invalidData = { name: 'John Doe', age: '30', email: 'invalid-email' }

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(ValidationError)
    })

    it('should include all validation errors in the ValidationError', async () => {
      const validationSchema = toValidationSchema(TestSchema)
      const invalidData = { name: 123, age: '30', email: 'invalid-email' }

      try {
        await validationSchema.validate(invalidData)
      }
      catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        if (!(error instanceof ValidationError))
          return
        expect(error.inner).toHaveLength(3)
        expect(error.inner).toMatchInlineSnapshot(`
          [
            {
              "message": "Expected string, actual 123",
              "path": "name",
            },
            {
              "message": "Expected number, actual "30"",
              "path": "age",
            },
            {
              "message": "Expected a string matching the pattern ^[\\w\\-.]+@([\\w-]+\\.)+[\\w-]{2,4}$, actual "invalid-email"",
              "path": "email",
            },
          ]
        `)
      }
    })
  })

  describe('toValidate', () => {
    it('should return undefined for valid data', async () => {
      const validate = toValidate(TestSchema)
      const validData = { name: 'John Doe', age: 30, email: 'john@example.com' }

      const result = await validate(validData)
      expect(result).toBeUndefined()
    })

    it('should return an object with error messages for invalid data', async () => {
      const validate = toValidate(TestSchema)
      const invalidData = { name: 'John Doe', age: '30', email: 'invalid-email' }

      const result = await validate(invalidData)
      expect(result).toMatchInlineSnapshot(`
        {
          "age": "Expected number, actual "30"",
          "email": "Expected a string matching the pattern ^[\\w\\-.]+@([\\w-]+\\.)+[\\w-]{2,4}$, actual "invalid-email"",
        }
      `)
    })

    it('should return multiple error messages for multiple invalid fields', async () => {
      const validate = toValidate(TestSchema)
      const invalidData = { name: 123, age: '30', email: 'invalid-email' }

      const result = await validate(invalidData)
      expect(result).toMatchInlineSnapshot(`
        {
          "age": "Expected number, actual "30"",
          "email": "Expected a string matching the pattern ^[\\w\\-.]+@([\\w-]+\\.)+[\\w-]{2,4}$, actual "invalid-email"",
          "name": "Expected string, actual 123",
        }
      `)
    })
  })
})
