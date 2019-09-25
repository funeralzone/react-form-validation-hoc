# React Form Validation HOC #

## Installation

```npm install @funeralguide/react-form-validation-hoc```

## Usage

For the moment the component only works with the `yup` validation framework.

Import the component using
```javascript
import { withValidation } from '@funeralguide/react-form-validation-hoc';
```

And when exporting your React component, make sure to wrap it with `withValidation` such as
```javascript
export default withValidation(MyComponent);
```

By doing this your component will have four props injected to it


* `errors`

This is an Object with the error strings generated after calling `validate` against a specific validation schema. For example if you schema looks like this:

```javascript
export const validationSchema = object().shape({
  name: string().nullable().required('Name is required'),
  address: string().nullable().required('Address is required');
```

it will generate an `errors` object that looks like this

```javascript
errors: {
  name: 'Name is required',
  address: 'Address is required',
};
```


* `formRefs` (optional use)

This is a collection of React refs, used for scrolling to HTML elements that have errors. To use this effectively, you will need to set these refs in their respective Nodes in your JSX.

The structure of this object is similar to the `errors` object above. So given the same validation schema as above you would get the following:

```javascript
formRefs: {
  name: { current: {...} },
  address: { current: {...} },
};
```


* `validate(formData, validationSchema, scrollToElement)`

This is the method you will want to call when you want to validate your form data and generate any errors. This method takes two required arguments `formData` and `validationSchema` and an optional third argument if you want scrolling to errors functionality.


* `generateRefs(fields)` (optional use)

This method is used to generate the `formRefs` properties to mirror your validation schema. Typically you will want to pass an array of property names for your form data. For example using a Yup validation schema:

```javascript
generateRefs(Object.keys(validationSchema.fields));
```

Make sure to call this method in your component's `constructor` or in `componentDidMount` if you want to use scroll to error functionality.
