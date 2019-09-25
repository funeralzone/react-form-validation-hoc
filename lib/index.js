'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withValidation = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jsxFileName = 'ValidationContext.jsx';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationContext = _react2.default.createContext({});

var ValidationProvider = function (_Component) {
  _inherits(ValidationProvider, _Component);

  function ValidationProvider(props) {
    _classCallCheck(this, ValidationProvider);

    var _this = _possibleConstructorReturn(this, (ValidationProvider.__proto__ || Object.getPrototypeOf(ValidationProvider)).call(this, props));

    _this.setErrors = function (errors) {
      var newErrors = _extends({}, errors);
      var isValid = Object.keys(newErrors).length === 0;

      _this.setState({
        errors: newErrors,
        isValid: isValid
      });
    };

    _this.validate = function (state, schema, scrollToErrors) {
      try {
        schema.validateSync(state, { abortEarly: false });
      } catch (errors) {
        var formattedErrors = ValidationProvider.buildErrors(errors);
        _this.setErrors(formattedErrors);
        if (scrollToErrors) {
          _this.scrollToError(formattedErrors);
        }
        return false;
      }
      _this.setErrors({});
      return true;
    };

    _this.generateRefs = function (fields) {
      var formRefs = fields.reduce(function (acc, field) {
        acc[field] = _react2.default.createRef();
        return acc;
      }, {});
      _this.setState({ formRefs: formRefs });
    };

    _this.scrollToError = function (errors) {
      if (!errors || Object.keys(errors).length === 0) {
        return;
      }

      var formRefs = _this.state.formRefs;

      var firstElementWithErrors = formRefs[Object.keys(errors)[0]];

      (0, _utils.scrollToElement)(firstElementWithErrors);
    };

    _this.state = {
      errors: {},
      formRefs: {},
      isValid: true,
      setErrors: _this.setErrors
    };
    return _this;
  }

  _createClass(ValidationProvider, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return _react2.default.createElement(
        ValidationContext.Provider,
        { value: _extends({}, this.state, {
            validate: this.validate,
            generateRefs: this.generateRefs
          }),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 105
          },
          __self: this
        },
        children
      );
    }
  }]);

  return ValidationProvider;
}(_react.Component);

ValidationProvider.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]).isRequired
};

ValidationProvider.buildErrors = function (validationResult) {
  if (!validationResult.inner || validationResult.inner.length === 0) {
    return {};
  }

  var errorList = validationResult.inner.reduce(function (acc, error) {
    var errors = acc;

    var _error$errors = _slicedToArray(error.errors, 1);

    errors[error.path] = _error$errors[0];

    return errors;
  }, {});

  var isPlainObject = function isPlainObject(obj) {
    return !!obj && obj.constructor === {}.constructor;
  };

  var getNestedObject = function getNestedObject(obj) {
    return Object.entries(obj).reduce(function (result, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          val = _ref2[1];

      var processedProp = prop.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      processedProp = processedProp.replace(/^\./, '');
      processedProp.split('.').reduce(function (nestedResult, property, propIndex, propArray) {
        var newResult = nestedResult;
        var lastProp = propIndex === propArray.length - 1;
        if (lastProp) {
          newResult[property] = isPlainObject(val) ? getNestedObject(val) : val;
        } else {
          newResult[property] = nestedResult[property] || {};
        }
        return nestedResult[property];
      }, result);
      return result;
    }, {});
  };

  return getNestedObject(errorList);
};

var withValidation = exports.withValidation = function withValidation(WrappedComponent) {
  var WrapValidationContext = function WrapValidationContext(props) {
    return _react2.default.createElement(
      ValidationProvider,
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 119
        },
        __self: undefined
      },
      _react2.default.createElement(
        ValidationContext.Consumer,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 120
          },
          __self: undefined
        },
        function (state) {
          return _react2.default.createElement(WrappedComponent, Object.assign({}, props, state, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            },
            __self: undefined
          }));
        }
      )
    );
  };
  return WrapValidationContext;
};
