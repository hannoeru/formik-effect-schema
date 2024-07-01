/* eslint-disable regexp/prefer-w */
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Schema as S } from '@effect/schema'
import { toValidationSchema } from 'formik-effect-schema'

const Email = S.pattern(
  // eslint-disable-next-line regexp/no-contradiction-with-assertion, regexp/no-obscure-range
  /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
  { message: () => 'Invalid email address' },
)

const formSchema = S.Struct({
  firstName: S.String.annotations({ message: () => 'First Name is required' }),
  lastName: S.String.annotations({ message: () => 'Last Name is required' }),
  email: S.String.pipe(Email),
})

type Values = S.Schema.Type<typeof formSchema>

function App() {
  return (
    <>
      <h1>Signup</h1>
      <Formik<Values>
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        validationSchema={toValidationSchema(formSchema)}
        onSubmit={(
          values,
          { setSubmitting },
        ) => {
          setTimeout(() => {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 500)
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="John" />
          <ErrorMessage name="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Doe" />
          <ErrorMessage name="lastName" />

          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="john@acme.com"
            type="email"
          />
          <ErrorMessage name="email" />

          <button type="submit">Login</button>
        </Form>
      </Formik>
    </>
  )
}

export default App
