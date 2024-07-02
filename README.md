# formik-effect-schema

[![NPM version](https://img.shields.io/npm/v/formik-effect-schema?color=a1b858&label=)](https://www.npmjs.com/package/formik-effect-schema)

This library adapts a [@effect/schema](https://github.com/Effect-TS/effect/tree/main/packages/schema) schema to work as a `validationSchema` prop or `validate` prop on [Formik](https://formik.org/)

## Install

```sh
# npm
$ npm install formik-effect-schema

# yarn
$ yarn add formik-effect-schema

# pnpm
$ pnpm add formik-effect-schema
```

## Usage

```TSX
import { Schema as S } from '@effect/schema'
import { Formik } from 'formik';
import { toValidationSchema } from 'formik-effect-schema';

const formSchema = S.Struct({
  name: S.String,
  age: S.Number,
})

type Values = S.Schema.Type<typeof formSchema>

const Component = () => (
  <Formik<Values>
    validationSchema={toValidationSchema(formSchema)}
  >
    {/** ... */}
  </Formik>
);
```

```TSX
import { Schema as S } from '@effect/schema'
import { Formik } from 'formik';
import { toValidate } from 'formik-effect-schema';

const formSchema = S.Struct({
  name: S.String,
  age: S.Number,
})

type Values = S.Schema.Type<typeof formSchema>

const Component = () => (
  <Formik<Values>
    validate={toValidate(formSchema)}
  >
    {/** ... */}
  </Formik>
);
```

## License

[MIT](./LICENSE) License © 2024 [hannoeru](https://github.com/hannoeru)
