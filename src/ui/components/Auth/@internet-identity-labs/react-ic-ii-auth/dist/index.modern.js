import { AuthClient } from '@dfinity/auth-client';
import React, { useContext } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded = ["src", "onLoad", "title", "name", "width", "height", "allow"];
var AuthIframe = function AuthIframe(_ref) {
  var src = _ref.src,
      onLoad = _ref.onLoad,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'idpWindow' : _ref$title,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'idpWindow' : _ref$name,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? '100%' : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? '100%' : _ref$height,
      _ref$allow = _ref.allow,
      allow = _ref$allow === void 0 ? 'publickey-credentials-get' : _ref$allow,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  return React.createElement("iframe", Object.assign({
    title: title,
    name: name,
    width: width,
    height: height,
    allow: allow,
    src: src,
    onLoad: onLoad
  }, props));
};

var _excluded$1 = ["onError", "onSuccess"];
var InternetIdentityContext = React.createContext({
  error: null,
  authClient: null,
  identityProvider: '',
  isAuthenticated: false,
  identity: null,
  authenticate: function authenticate() {
    return new Promise(function () {
      return null;
    });
  },
  signout: function signout() {
    return null;
  }
});

var useICIIAuth = function useICIIAuth(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$authClientOption = _ref.authClientOptions;

  _ref$authClientOption = _ref$authClientOption === void 0 ? {} : _ref$authClientOption;

  var onError = _ref$authClientOption.onError,
      onSuccess = _ref$authClientOption.onSuccess,
      authClientOptions = _objectWithoutPropertiesLoose(_ref$authClientOption, _excluded$1);

  var _React$useState = React.useState(null),
      authClient = _React$useState[0],
      setAuthClient = _React$useState[1];

  var _React$useState2 = React.useState(false),
      isAuthenticated = _React$useState2[0],
      setIsAuthenticated = _React$useState2[1];

  var _React$useState3 = React.useState(null),
      error = _React$useState3[0],
      setError = _React$useState3[1];

  var identityProvider = (authClientOptions.identityProvider || 'https://identity.ic0.app/#authorize').toString();
  var createAuthClient = React.useCallback(function () {
    try {
      return Promise.resolve(AuthClient.create()).then(function (authClient) {
        setAuthClient(authClient);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, []);
  React.useEffect(function () {
    createAuthClient();
  }, [createAuthClient]);
  var setAuthStatus = React.useCallback(function (authClient) {
    try {
      var _temp4 = function _temp4(_result) {
        return _exit2 ? _result : setIsAuthenticated(false);
      };

      var _exit2 = false;

      var _temp5 = function () {
        if (authClient) {
          return Promise.resolve(authClient.isAuthenticated()).then(function (isAuthenticated) {
            var _setIsAuthenticated = setIsAuthenticated(isAuthenticated);

            _exit2 = true;
            return _setIsAuthenticated;
          });
        }
      }();

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  }, []);
  React.useEffect(function () {
    authClient && setAuthStatus(authClient);
  }, [authClient, setAuthStatus]);
  var handleOnSuccess = React.useCallback(function (authClient) {
    setIsAuthenticated(true);
    onSuccess && onSuccess(authClient.getIdentity());
  }, [onSuccess]);
  var handleOnError = React.useCallback(function (error) {
    setError(error);
    onError && onError(error);
  }, [onError]);
  var authenticate = React.useCallback(function () {
    try {
      var _temp7 = function () {
        if (authClient) {
          return Promise.resolve(authClient.login(_extends({
            onSuccess: function onSuccess() {
              return handleOnSuccess(authClient);
            },
            onError: handleOnError,
            identityProvider: identityProvider
          }, authClientOptions))).then(function () {});
        }
      }();

      return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [authClient, authClientOptions, handleOnError, handleOnSuccess, identityProvider]);
  var signout = React.useCallback(function () {
    try {
      var _temp9 = function () {
        if (authClient) {
          return Promise.resolve(authClient.logout()).then(function () {
            setIsAuthenticated(false);
          });
        }
      }();

      return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [authClient]);
  return {
    error: error,
    authClient: authClient,
    identityProvider: identityProvider,
    isAuthenticated: isAuthenticated,
    identity: authClient ? authClient.getIdentity() : null,
    authenticate: authenticate,
    signout: signout
  };
};

var InternetIdentityProvider = function InternetIdentityProvider(_ref2) {
  var children = _ref2.children,
      _ref2$authClientOptio = _ref2.authClientOptions,
      authClientOptions = _ref2$authClientOptio === void 0 ? {} : _ref2$authClientOptio;
  var authContext = useICIIAuth({
    authClientOptions: authClientOptions
  });
  return React.createElement(InternetIdentityContext.Provider, {
    value: authContext
  }, children);
};
var useInternetIdentity = function useInternetIdentity() {
  return useContext(InternetIdentityContext);
};

export { AuthIframe, InternetIdentityContext, InternetIdentityProvider, useInternetIdentity };
//# sourceMappingURL=index.modern.js.map
