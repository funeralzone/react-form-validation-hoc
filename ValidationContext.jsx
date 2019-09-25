import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scrollToElement } from './utils';

const ValidationContext = React.createContext({});

class ValidationProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  }

  static buildErrors = (validationResult) => {
    if (!validationResult.inner || validationResult.inner.length === 0) {
      return {};
    }

    const errorList = validationResult.inner.reduce((acc, error) => {
      const errors = acc;
      [errors[error.path]] = error.errors;
      return errors;
    }, {});

    const isPlainObject = obj => !!obj && obj.constructor === {}.constructor;

    const getNestedObject = obj => Object.entries(obj).reduce((result, [prop, val]) => {
      let processedProp = prop.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      processedProp = processedProp.replace(/^\./, '');
      processedProp.split('.').reduce((nestedResult, property, propIndex, propArray) => {
        const newResult = nestedResult;
        const lastProp = propIndex === propArray.length - 1;
        if (lastProp) {
          newResult[property] = isPlainObject(val) ? getNestedObject(val) : val;
        } else {
          newResult[property] = nestedResult[property] || {};
        }
        return nestedResult[property];
      }, result);
      return result;
    }, {});

    return getNestedObject(errorList);
  };

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      formRefs: {},
      isValid: true,
      setErrors: this.setErrors,
    };
  }

  setErrors = (errors) => {
    const newErrors = { ...errors };
    const isValid = (Object.keys(newErrors).length === 0);

    this.setState({
      errors: newErrors,
      isValid,
    });
  }

  validate = (state, schema, scrollToErrors) => {
    try {
      schema.validateSync(state, { abortEarly: false });
    } catch (errors) {
      const formattedErrors = ValidationProvider.buildErrors(errors);
      this.setErrors(formattedErrors);
      if (scrollToErrors) {
        this.scrollToError(formattedErrors);
      }
      return false;
    }
    this.setErrors({});
    return true;
  }

  generateRefs = (fields) => {
    const formRefs = fields.reduce((acc, field) => {
      acc[field] = React.createRef();
      return acc;
    }, {});
    this.setState({ formRefs });
  }

  scrollToError = (errors) => {
    if (!errors || Object.keys(errors).length === 0) {
      return;
    }

    const { formRefs } = this.state;
    const firstElementWithErrors = formRefs[Object.keys(errors)[0]];

    scrollToElement(firstElementWithErrors);
  }

  render() {
    const { children } = this.props;
    return (
      <ValidationContext.Provider value={{
        ...this.state,
        validate: this.validate,
        generateRefs: this.generateRefs,
      }}
      >
        {children}
      </ValidationContext.Provider>
    );
  }
}

export const withValidation = (WrappedComponent) => {
  const WrapValidationContext = props => (
    <ValidationProvider>
      <ValidationContext.Consumer>
        {state => (
          <WrappedComponent {...props} {...state} />
        )}
      </ValidationContext.Consumer>
    </ValidationProvider>
  );
  return WrapValidationContext;
};
