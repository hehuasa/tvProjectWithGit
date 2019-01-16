// (function (global, factory) {
//   if (typeof define === 'function' && define.amd) {
//     define(['exports', 'module'], factory);
//   } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
//     factory(exports, module);
//   } else {
//     const mod = {
//       exports: {},
//     };
//     factory(mod.exports, mod);
//     global.fetchJsonp = mod.exports;
//   }
// }(this, (exports, module) => {

//
//
//   // export as global function
//   // let local;
//   // if (typeof global !== 'undefined') {
//   //   local = global;
//   // } else if (typeof self !== 'undefined') {
//   //   local = self;
//   // } else {
//   //   try {
//   //     local = Function('return this')();
//   //   } catch (e) {
//   //     throw new Error('polyfill failed because global object is unavailable in this environment');
//   //   }
//   // }
//   // local.fetchJsonp = fetchJsonp;
//   module.exports = fetchJsonp;
// }));
function generateCallbackFunction() {
  return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
}
  const defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null,
  };
function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName];
  } catch (e) {
    window[functionName] = undefined;
  }
}

function removeScript(scriptId) {
  const script = document.getElementById(scriptId);
  if (script) {
    document.getElementsByTagName('head')[0].removeChild(script);
  }
}

function fetchJsonp(_url) {
  const options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  // to avoid param reassign
  let url = _url;
  const timeout = options.timeout || defaultOptions.timeout;
  const jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

  let timeoutId;
  const fun = () => {
    const callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
    const scriptId = `${jsonpCallback}_${callbackFunction}`;

    window[callbackFunction] = function () {
      if (timeoutId) clearTimeout(timeoutId);
      removeScript(scriptId);
      clearFunction(callbackFunction);
    };

    // Check if the user set their own params, and if not add a ? to start a list of params
    url += url.indexOf('?') === -1 ? '?' : '&';

    const jsonpScript = document.createElement('script');
    jsonpScript.setAttribute('src', `${url}${jsonpCallback}=${callbackFunction}`);
    if (options.charset) {
      jsonpScript.setAttribute('charset', options.charset);
    }
    jsonpScript.id = scriptId;
    document.getElementsByTagName('head')[0].appendChild(jsonpScript);

    timeoutId = setTimeout(() => {
      clearFunction(callbackFunction);
      removeScript(scriptId);
      window[callbackFunction] = function () {
        clearFunction(callbackFunction);
      };
    }, timeout);

    // Caught if got 404/500
    jsonpScript.onerror = function () {
      clearFunction(callbackFunction);
      removeScript(scriptId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  };
   fun();
  // return new Promise(((resolve, reject) => {
  //
  //   const callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
  //   const scriptId = `${jsonpCallback}_${callbackFunction}`;
  //
  //   window[callbackFunction] = function (response) {
  //     resolve({
  //       ok: true,
  //       // keep consistent with fetch API
  //       json: function json() {
  //         return Promise.resolve(response);
  //       },
  //     });
  //
  //     if (timeoutId) clearTimeout(timeoutId);
  //
  //     removeScript(scriptId);
  //
  //     clearFunction(callbackFunction);
  //   };
  //
  //   // Check if the user set their own params, and if not add a ? to start a list of params
  //   url += url.indexOf('?') === -1 ? '?' : '&';
  //
  //   const jsonpScript = document.createElement('script');
  //   jsonpScript.setAttribute('src', `${url}${jsonpCallback}=${callbackFunction}`);
  //   if (options.charset) {
  //     jsonpScript.setAttribute('charset', options.charset);
  //   }
  //   jsonpScript.id = scriptId;
  //   document.getElementsByTagName('head')[0].appendChild(jsonpScript);
  //
  //   timeoutId = setTimeout(() => {
  //     reject(new Error(`JSONP request to ${_url} timed out`));
  //
  //     clearFunction(callbackFunction);
  //     removeScript(scriptId);
  //     window[callbackFunction] = function () {
  //       clearFunction(callbackFunction);
  //     };
  //   }, timeout);
  //
  //   // Caught if got 404/500
  //   jsonpScript.onerror = function () {
  //     reject(new Error(`JSONP request to ${_url} failed`));
  //
  //     clearFunction(callbackFunction);
  //     removeScript(scriptId);
  //     if (timeoutId) clearTimeout(timeoutId);
  //   };
  // }));
}
export default fetchJsonp;
