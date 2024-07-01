import { ArrayFormatter, Schema as S } from '@effect/schema'
import { Either as E } from 'effect'

import type { ParseOptions } from '@effect/schema/AST'

export class ValidationError extends Error {
  public name = 'ValidationError'
  public inner: Array<{ path: string, message: string }> = []
  public constructor(message: string) {
    super(message)
  }
}

function createValidationError(issues: ArrayFormatter.Issue[]): ValidationError {
  const error = new ValidationError('Validation failed')
  error.inner = issues.map(issue => ({
    message: issue.message,
    path: issue.path.join('.'),
  }))
  return error
}

/**
 * Wrap your `@effect/schema` schema in this function when providing it to Formik's `validationSchema` prop
 * @param schema The `@effect/schema` schema
 * @param options The `@effect/schema` decode options. Defaults to `{ errors: 'all' }`
 * @returns An object containing the `validate` method expected by Formik
 */
export function toValidationSchema<I, A>(
  schema: S.Schema<I, A>,
  options?: ParseOptions,
): { validate: (values: unknown) => Promise<void> } {
  return {
    async validate(values: unknown) {
      const result = S.decodeUnknownEither(schema, {
        errors: 'all',
        ...options,
      })(values).pipe(E.mapLeft(error => ArrayFormatter.formatErrorSync(error)))
      if (E.isLeft(result)) {
        throw createValidationError(result.left)
      }
    },
  }
}

function createValidationResult(issues: ArrayFormatter.Issue[]) {
  const result: Record<string, string> = {}
  for (const issue of issues) {
    result[issue.path.join('.')] = issue.message
  }
  return result
}

/**
 * Wrap your `@effect/schema` schema in this function when providing it to Formik's `validate` prop
 * @param schema The `@effect/schema` schema
 * @param options The `@effect/schema` decode options. Defaults to `{ errors: 'all' }`
 * @returns An validate function as expected by Formik
 */
export function toValidate<I, A>(
  schema: S.Schema<I, A>,
  options?: ParseOptions,
) {
  return async (values: unknown) => {
    const result = S.decodeUnknownEither(schema, {
      errors: 'all',
      ...options,
    })(values).pipe(E.mapLeft(error => ArrayFormatter.formatErrorSync(error)))
    if (E.isLeft(result)) {
      return createValidationResult(result.left)
    }
  }
}
