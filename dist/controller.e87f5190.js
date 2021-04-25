// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"src/js/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBookmarkPage = exports.toggleBookmark = exports.getKeysArr = exports.getButtonIngPage = exports.getButtonsFoodPage = exports.loadCategorySearch = exports.loadLucky = exports.loadCategories = exports.loadFoodIng = exports.getPage = exports.getSearchResultsPage = exports.getNewPageNumber = exports.loadSearchResults = exports.apiCall = exports.state = void 0;

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 9,
    context: ''
  },
  ingredient: {
    id: '',
    results: [],
    page: 1,
    resultsPerPage: 6,
    isBookmarked: false
  },
  bookmarks: {
    entries: [],
    resultsPerPage: 9,
    page: 1
  }
};
exports.state = state;

var apiCall = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee(url) {
    var response;
    return _regeneratorRuntime.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(url);

          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();

          case 6:
            return _context.abrupt("return", _context.sent);

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function apiCall(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.apiCall = apiCall;

var loadSearchResults = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee2(query) {
    var _data;

    return _regeneratorRuntime.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return apiCall("https://www.themealdb.com/api/json/v1/1/filter.php?i=".concat(query));

          case 3:
            _data = _context2.sent;
            state.search.results = _data;
            state.search.page = 1; // Resetting page count if we got new searches

            state.search.context = 'food'; // Changing context

            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function loadSearchResults(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loadSearchResults = loadSearchResults;

var getNewPageNumber = function getNewPageNumber(str) {
  if (str === 'fa-arrow-right') return 1;
  if (str === 'fa-arrow-left') return -1;else return 0;
};

exports.getNewPageNumber = getNewPageNumber;

var getSearchResultsPage = function getSearchResultsPage() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : state.search.results.meals;
  var RES_PER_PAGE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
  // Finding what page to load;
  if (!page) page = 1;

  if (arr === state.search.results.meals || arr === state.search.results) {
    state.search.page += getNewPageNumber(page);
    page = state.search.page;
  } else {
    state.recipe.page += getNewPageNumber(page);
    page = state.ingredient.page;
  }

  return getPage(page, arr, RES_PER_PAGE);
};

exports.getSearchResultsPage = getSearchResultsPage;

var getPage = function getPage(pageNum, arr) {
  var RES_PER_PAGE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
  var lowerLim = (pageNum - 1) * RES_PER_PAGE;
  var upperLim = pageNum * RES_PER_PAGE;
  return arr.slice(lowerLim, upperLim);
};

exports.getPage = getPage;

var loadFoodIng = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee3(id) {
    var _data2;

    return _regeneratorRuntime.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return apiCall("https://www.themealdb.com/api/json/v1/1/lookup.php?i=".concat(id));

          case 3:
            _data2 = _context3.sent;
            state.ingredient.page = 1;
            state.ingredient.id = id;
            state.ingredient.results = _data2.meals[0];
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.error(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function loadFoodIng(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.loadFoodIng = loadFoodIng;

var loadCategories = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee4() {
    var _data3;

    return _regeneratorRuntime.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return apiCall('https://www.themealdb.com/api/json/v1/1/categories.php');

          case 3:
            _data3 = _context4.sent;
            state.search.results = _data3.categories;
            state.search.page = 1; // Resetting page count if we got new searches

            state.search.context = 'categ'; // Changing context

            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 9]]);
  }));

  return function loadCategories() {
    return _ref4.apply(this, arguments);
  };
}();

exports.loadCategories = loadCategories;

var loadLucky = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee5() {
    var _data4;

    return _regeneratorRuntime.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return apiCall('https://www.themealdb.com/api/json/v1/1/random.php');

          case 3:
            _data4 = _context5.sent;
            state.search.results = _data4;
            state.search.page = 1; // Resetting page count if we got new searches

            state.search.context = 'luck'; // Changing context

            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 9]]);
  }));

  return function loadLucky() {
    return _ref5.apply(this, arguments);
  };
}();

exports.loadLucky = loadLucky;

var loadCategorySearch = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee6(category) {
    var _data5;

    return _regeneratorRuntime.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return apiCall("https://www.themealdb.com/api/json/v1/1/filter.php?c=".concat(category));

          case 3:
            _data5 = _context6.sent;
            state.search.results = _data5;
            state.search.page = 1; // Resetting page count if we got new searches

            state.search.context = 'food'; // Changing context

            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 9]]);
  }));

  return function loadCategorySearch(_x4) {
    return _ref6.apply(this, arguments);
  };
}(); // For button in search tab


exports.loadCategorySearch = loadCategorySearch;

var getButtonsFoodPage = function getButtonsFoodPage(pageToSend, pages) {
  // There is only 1 page
  if (pageToSend === 1 && pages === 1) return header; // There are other pages

  if (pageToSend > 1 && pageToSend < pages) {
    return leftArrowBtn + rightArrowBtn + header;
  } // Last page and there are other pages


  if (pageToSend === pages && pages > 1) return leftArrowBtn + header; // First page and there are other pages

  if (pageToSend === 1 && pages > 1) return rightArrowBtn + header;
}; // For button in ingredient tab


exports.getButtonsFoodPage = getButtonsFoodPage;

var getButtonIngPage = function getButtonIngPage(pageToSend, pages) {
  if (pageToSend === 1 && pages === 1) return ''; // There are other pages

  if (pageToSend > 1 && pageToSend < pages) {
    return leftArrowBtn + rightArrowBtn;
  } // Last page and there are other pages


  if (pageToSend === pages && pages > 1) return leftArrowBtn; // First page and there are other pages

  if (pageToSend === 1 && pages > 1) return rightArrowBtn;
};

exports.getButtonIngPage = getButtonIngPage;

var getKeysArr = function getKeysArr(ingObj, str) {
  var arr = Object.keys(ingObj).filter(function (ing) {
    return ing.includes(str) && ingObj[ing];
  });
  return arr.map(function (str) {
    return ingObj[str];
  });
};

exports.getKeysArr = getKeysArr;

var toggleBookmark = function toggleBookmark(recipe) {
  if (recipe.isBookmarked === true) {
    recipe.isBookmarked = false;
    deleteBookmark(recipe.id);
  } else {
    recipe.isBookmarked = true;
    state.bookmarks.entries.push(recipe);
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks.entries));
  }

  state.ingredient.isBookmarked = true;
};

exports.toggleBookmark = toggleBookmark;

var getBookmarkPage = function getBookmarkPage(goToPage) {
  var RES_PER_PAGE = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
  state.bookmarks.page += getNewPageNumber(goToPage);
  var page = state.bookmarks.page;
  state.search.context = 'bookmarks';
  state.bookmarks.context = 'bookmark';
  return getPage(state.bookmarks.page, state.bookmarks.entries, RES_PER_PAGE);
};

exports.getBookmarkPage = getBookmarkPage;

var init = function init() {
  var storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks.entries = JSON.parse(storage);
};

init();

var deleteBookmark = function deleteBookmark(id) {
  var index = state.bookmarks.entries.findIndex(function (el) {
    return el.id === id;
  });
  state.bookmarks.entries.splice(index, 1);
};
},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js"}],"src/js/views/View.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var View = /*#__PURE__*/function () {
  function View() {
    _classCallCheck(this, View);

    _defineProperty(this, "_data", void 0);

    _defineProperty(this, "_clear", function () {
      this._parentElement.innerHTML = '';
    });
  }

  _createClass(View, [{
    key: "render",
    value: function render(data) {
      var _render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var isClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      this._data = data;

      var markup = this._generateMarkup();

      if (!_render) return markup;
      if (isClear) this._clear();

      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }]);

  return View;
}();

exports.default = View;
},{}],"src/js/views/foodsView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var foodsView = /*#__PURE__*/function (_View) {
  _inherits(foodsView, _View);

  var _super = _createSuper(foodsView);

  function foodsView() {
    var _this;

    _classCallCheck(this, foodsView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.grid'));

    _defineProperty(_assertThisInitialized(_this), "_UIbtn", document.querySelector('.fa'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.querry-box'));

    _defineProperty(_assertThisInitialized(_this), "_content", document.querySelector('.search'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find any recipies with that ingredient');

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(foodsView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        if (!(e.target.className === 'small-imgs food')) return;
        var foodID = e.target.closest('.item').id;
        handler(foodID);
      });
    }
  }, {
    key: "openWindow",
    value: function openWindow() {
      this._overlay.classList.remove('hidden');

      this._content.classList.remove('hidden');
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      this._content.classList.add('hidden');
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      this.openWindow();
      return this._data.map(function (recipe) {
        if (recipe.strMeal.length > 24) {
          recipe.strMeal = "".concat(recipe.strMeal.slice(0, 21), "...");
        }

        return "\n        <i class=\"item\" id=\"".concat(recipe.idMeal, "\">\n        <img src=\"").concat(recipe.strMealThumb, "\" class=\"small-imgs food\"/>\n        <h6>").concat(recipe.strMeal, "</h6>\n        </i>");
      }).join('');
    }
  }]);

  return foodsView;
}(_View2.default);

var _default = new foodsView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/views/ingredientView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var foodsView = /*#__PURE__*/function (_View) {
  _inherits(foodsView, _View);

  var _super = _createSuper(foodsView);

  function foodsView() {
    var _this;

    _classCallCheck(this, foodsView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.itemGrid'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find any ingredient with that recipe');

    _defineProperty(_assertThisInitialized(_this), "_content", document.querySelector('.search'));

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(foodsView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        if (!(e.target.className === 'goto-recipe')) return;
        handler(e.target.attributes.link.nodeValue);
      });
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      this._content.classList.remove('hidden');

      this._parentElement.classList.add('hidden');
    }
  }, {
    key: "openWindow",
    value: function openWindow() {
      this._content.classList.add('hidden');

      this._parentElement.classList.remove('hidden');
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var _this2 = this;

      this.openWindow();

      var ingredients = this._data.ingredients.map(function (ing, i) {
        return "\n    <i class=\"ingredient-item\">".concat(ing, "</i>\n    <i class=\"ingredient-quantity\">").concat(_this2._data.quantities[i], "</i>");
      }).join('');

      var bookmark = this._data.isBookmarked ? '<i class="fa fa-bookmark" aria-hidden="true"></i>' : '<i class="fa fa-bookmark-o" aria-hidden="true"></i>';
      return "\n              <div class=\"green-filter\">\n                  <img\n                    src=\"".concat(this._data.strMealThumb, "\"\n                    class=\"food-photo\"\n                    />\n                    ").concat(bookmark, "\n                </div>\n                <h1 class=\"ingredient-text\">Ingredients</h1>\n                <div class=\"grid ingredient-box\">\n                ").concat(ingredients, "\n                </div>\n                <div class=\"center\">\n                  <button class=\"goto-recipe\" link=\"").concat(this._data.strYoutube, "\">Go to Page\n                  </div>");
    }
  }]);

  return foodsView;
}(_View2.default);

var _default = new foodsView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/views/navView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var navView = /*#__PURE__*/function (_View) {
  _inherits(navView, _View);

  var _super = _createSuper(navView);

  function navView() {
    var _this;

    _classCallCheck(this, navView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.nav-bar'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find any categories');

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(navView, [{
    key: "addHandlerClick",
    value: // addHandlerArrow(handler) {
    //   this._UIbtn.addEventListener('click', handler);
    // }
    function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        if (!e.target.className === 'small-imgs') return;
        if (e.target.className.includes('categ')) handler('categ');
        if (e.target.className.includes('luck')) handler('luck');
        if (e.target.className.includes('bookmark')) handler('bookmark');
        if (e.target.className.includes('about')) handler('about');
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      this.openWindow();
      return this._data.map(function (recipe) {
        if (recipe.strMeal.length > 24) {
          recipe.strMeal = "".concat(recipe.strMeal.slice(0, 21), "...");
        }

        return "\n        <i class=\"item\" id=\"".concat(recipe.idMeal, "\">\n        <img src=\"").concat(recipe.strMealThumb, "\" class=\"small-imgs\"/>\n        <h6>").concat(recipe.strMeal, "</h6>\n        </i>");
      }).join('');
    }
  }]);

  return navView;
}(_View2.default);

var _default = new navView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/views/pagination/paginationFoodView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("../View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PaginationView = /*#__PURE__*/function (_View) {
  _inherits(PaginationView, _View);

  var _super = _createSuper(PaginationView);

  function PaginationView() {
    var _this;

    _classCallCheck(this, PaginationView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.header'));

    return _this;
  }

  _createClass(PaginationView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.fa');
        if (!btn) return;
        handler(btn.classList[1]);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var curPage, numPages, header;

      if (this._data.context === 'food') {
        header = "<span class=\"text\">\n      <h2 class=\"header-text\">Search Results</h2>\n      </span>";
        curPage = this._data.page;
        numPages = Math.ceil(this._data.results.meals.length / this._data.resultsPerPage);
      }

      if (this._data.context === 'categ') {
        header = "<span class=\"text\">\n        <h2 class=\"header-text\">Categories</h2>\n        </span>";
        curPage = this._data.page;
        numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
      }

      if (this._data.context === 'luck') {
        header = "<span class=\"text\">\n          <h2 class=\"header-text\">Lucky Search</h2>\n          </span>";
        curPage = this._data.page;
        numPages = Math.ceil(this._data.results.meals.length / this._data.resultsPerPage);
      }

      if (this._data.context === 'bookmark') {
        header = "<span class=\"text\">\n      <h2 class=\"header-text\">Bookmarks</h2>\n      </span>";
        curPage = this._data.page;
        numPages = Math.ceil(this._data.entries.length / this._data.resultsPerPage);
        numPages = numPages ? numPages : 1;
      }

      if (this._data.context === 'about') {
        return "<span class=\"text\">\n      <h2 class=\"header-text\">About</h2>\n      </span>";
      }

      var rendNextButton = function rendNextButton() {
        return "<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>";
      };

      var rendPrevButton = function rendPrevButton() {
        return "<i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i>";
      }; // Page 1, and there are other pages


      if (curPage === 1 && numPages > 1) {
        return header + rendNextButton();
      } // Page 1, and there are no other pages


      if (curPage === 1 && numPages === 1) {
        return header;
      } // Last page


      if (curPage === numPages) {
        return rendPrevButton() + header;
      } // Other page


      if (curPage < numPages) {
        return rendNextButton() + rendPrevButton() + header;
      }
    }
  }]);

  return PaginationView;
}(_View2.default);

var _default = new PaginationView();

exports.default = _default;
},{"../View.js":"src/js/views/View.js"}],"src/js/views/searchView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchView = /*#__PURE__*/function () {
  function SearchView() {
    _classCallCheck(this, SearchView);

    _defineProperty(this, "_parentEl", document.querySelector('.search-bar'));
  }

  _createClass(SearchView, [{
    key: "getQuery",
    value: function getQuery() {
      var query = this._parentEl.querySelector('.input-field').value;

      this._clearInput();

      return query;
    }
  }, {
    key: "_clearInput",
    value: function _clearInput() {
      this._parentEl.querySelector('.input-field').value = '';
    }
  }, {
    key: "addHandlerSearch",
    value: function addHandlerSearch(handler) {
      this._parentEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handler();
      });
    }
  }]);

  return SearchView;
}();

var _default = new SearchView();

exports.default = _default;
},{}],"src/js/views/pagination/paginationIngredientView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("../View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PaginationIngView = /*#__PURE__*/function (_View) {
  _inherits(PaginationIngView, _View);

  var _super = _createSuper(PaginationIngView);

  function PaginationIngView() {
    var _this;

    _classCallCheck(this, PaginationIngView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.itemGrid'));

    return _this;
  }

  _createClass(PaginationIngView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        var btn = e.target.closest('.fa');
        if (!btn) return;
        handler(btn.classList[1]);
      });
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      var curPage = this._data.page;
      var numPages = Math.ceil(this._data.allIngredients.length / this._data.resultsPerPage);

      var rendNextButton = function rendNextButton() {
        return "<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>";
      };

      var rendPrevButton = function rendPrevButton() {
        return "<i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i>";
      }; // Page 1, and there are other pages


      if (curPage === 1 && numPages > 1) {
        return rendNextButton();
      } // Page 1, and there are no other pages


      if (curPage === 1 && numPages === 1) {
        return '';
      } // Last page


      if (curPage === numPages) {
        return rendPrevButton();
      } // Other page


      if (curPage < numPages) {
        return rendNextButton() + rendPrevButton();
      }
    }
  }]);

  return PaginationIngView;
}(_View2.default);

var _default = new PaginationIngView();

exports.default = _default;
},{"../View.js":"src/js/views/View.js"}],"src/js/views/categoriesView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var categoriesView = /*#__PURE__*/function (_View) {
  _inherits(categoriesView, _View);

  var _super = _createSuper(categoriesView);

  function categoriesView() {
    var _this;

    _classCallCheck(this, categoriesView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.grid'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.querry-box'));

    _defineProperty(_assertThisInitialized(_this), "_content", document.querySelector('.search'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find any categories');

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(categoriesView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        if (!(e.target.className === 'small-imgs categ')) return;
        var category = e.target.closest('.item').id;
        handler(category);
      });
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      this._overlay.classList.add('hidden');

      this._content.classList.add('hidden');
    }
  }, {
    key: "openWindow",
    value: function openWindow() {
      this._overlay.classList.remove('hidden');

      this._content.classList.remove('hidden');
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      this._clear();

      this.openWindow();
      return this._data.map(function (recipe) {
        return "\n        <i class=\"item\" id=\"".concat(recipe.strCategory, "\">\n        <img src=\"").concat(recipe.strCategoryThumb, "\" class=\"small-imgs categ\"/>\n        <h6 class=\"center\">").concat(recipe.strCategory, "</h6>\n        </i>");
      }).join('');
    }
  }]);

  return categoriesView;
}(_View2.default);

var _default = new categoriesView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/views/bookmarkView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bookmarkView = /*#__PURE__*/function (_View) {
  _inherits(bookmarkView, _View);

  var _super = _createSuper(bookmarkView);

  function bookmarkView() {
    var _this;

    _classCallCheck(this, bookmarkView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.grid'));

    _defineProperty(_assertThisInitialized(_this), "_UIbtn", document.querySelector('.fa'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.querry-box'));

    _defineProperty(_assertThisInitialized(_this), "_content", document.querySelector('.search'));

    _defineProperty(_assertThisInitialized(_this), "_errorMessage", 'We could not find any recipies with that ingredient');

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(bookmarkView, [{
    key: "openWindow",
    value: function openWindow() {
      this._overlay.classList.remove('hidden');

      this._content.classList.remove('hidden');
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      this._content.classList.add('hidden');
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      this.openWindow();
      return this._data.map(function (recipe) {
        if (recipe.strMeal.length > 24) {
          recipe.strMeal = "".concat(recipe.strMeal.slice(0, 21), "...");
        }

        return "\n        <i class=\"item\" id=\"".concat(recipe.id, "\">\n        <img src=\"").concat(recipe.strMealThumb, "\" class=\"small-imgs food\"/>\n        <h6>").concat(recipe.strMeal, "</h6>\n        </i>");
      }).join('');
    }
  }]);

  return bookmarkView;
}(_View2.default);

var _default = new bookmarkView(); //insertNewHTML(tableElements, markup);


exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/views/aboutView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var foodsView = /*#__PURE__*/function (_View) {
  _inherits(foodsView, _View);

  var _super = _createSuper(foodsView);

  function foodsView() {
    var _this;

    _classCallCheck(this, foodsView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_parentElement", document.querySelector('.grid'));

    _defineProperty(_assertThisInitialized(_this), "_UIbtn", document.querySelector('.fa'));

    _defineProperty(_assertThisInitialized(_this), "_overlay", document.querySelector('.querry-box'));

    _defineProperty(_assertThisInitialized(_this), "_content", document.querySelector('.search'));

    _defineProperty(_assertThisInitialized(_this), "_message", '');

    return _this;
  }

  _createClass(foodsView, [{
    key: "addHandlerClick",
    value: function addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function (e) {
        if (!e.target.className.includes('small-imgs-about')) return;
        handler(e.target.classList[1]);
      });
    }
  }, {
    key: "openWindow",
    value: function openWindow() {
      this._overlay.classList.remove('hidden');

      this._content.classList.remove('hidden');
    }
  }, {
    key: "hideWindow",
    value: function hideWindow() {
      this._content.classList.add('hidden');
    }
  }, {
    key: "_generateMarkup",
    value: function _generateMarkup() {
      this.openWindow();
      return "\n    <i class=\"item\">\n    <img src=\"http://pngimg.com/uploads/github/github_PNG40.png\" class=\"small-imgs-about github\"/>\n    <h4 class=\"center\">GitHub</h4>\n    </i>\n    <i class=\"item\">\n    <img src=\"https://image.flaticon.com/icons/png/512/61/61109.png\" class=\"small-imgs-about linkedin\" />\n    <h4 class=\"center\">Linkedin</h4>\n    </i>";
    }
  }]);

  return foodsView;
}(_View2.default);

var _default = new foodsView();

exports.default = _default;
},{"./View.js":"src/js/views/View.js"}],"src/js/controller.js":[function(require,module,exports) {
"use strict";

var model = _interopRequireWildcard(require("./model.js"));

var _foodsView = _interopRequireDefault(require("./views/foodsView.js"));

var _ingredientView = _interopRequireDefault(require("./views/ingredientView.js"));

var _navView = _interopRequireDefault(require("./views/navView.js"));

var _paginationFoodView = _interopRequireDefault(require("./views//pagination/paginationFoodView.js"));

var _searchView = _interopRequireDefault(require("./views/searchView.js"));

var _paginationIngredientView = _interopRequireDefault(require("./views/pagination/paginationIngredientView.js"));

var _categoriesView = _interopRequireDefault(require("./views/categoriesView.js"));

var _regeneratorRuntime = require("regenerator-runtime");

var _bookmarkView = _interopRequireDefault(require("./views/bookmarkView.js"));

var _aboutView = _interopRequireDefault(require("./views/aboutView.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var controlSearch = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var query;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // 1) Getting search querry
            query = _searchView.default.getQuery(); // 2) Load Search Results

            _context.next = 3;
            return model.loadSearchResults(query);

          case 3:
            // 3) Hide Ingredient View (if there is)
            _ingredientView.default.hideWindow(); // 4) Render Results


            _foodsView.default.render(model.getSearchResultsPage()); // 5) Render Buttons


            _paginationFoodView.default.render(model.state.search); // console.log(model.state.search.results);


          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function controlSearch() {
    return _ref.apply(this, arguments);
  };
}();

var controlFoodPagination = function controlFoodPagination(goToPage) {
  if (model.state.search.context === 'categ') {
    // 1) Render New Results
    _categoriesView.default.render(model.getSearchResultsPage(goToPage, model.state.search.results)); // 2) Render New Pagination Buttons


    _paginationFoodView.default.render(model.state.search);
  }

  if (model.state.search.context === 'food') {
    // 1) Render New Results
    _foodsView.default.render(model.getSearchResultsPage(goToPage)); // 2) Render New Pagination Buttons


    _paginationFoodView.default.render(model.state.search);
  }

  if (model.state.search.context === 'bookmarks') {
    // 1) Render Results
    _bookmarkView.default.render(model.getBookmarkPage(goToPage)); // 2) Render Buttons


    _paginationFoodView.default.render(model.state.bookmarks);
  }
};

var makeIngObject = function makeIngObject(goToPage) {
  return {
    // Food image
    strMeal: model.state.ingredient.results.strMeal,
    strMealThumb: model.state.ingredient.results.strMealThumb,
    strYoutube: model.state.ingredient.results.strYoutube,
    // Food ingredient (only 6 per page)
    ingredients: model.getSearchResultsPage(goToPage, model.getKeysArr(model.state.ingredient.results, 'strIngredient'), model.state.ingredient.resultsPerPage),
    // Food Ingredient Quantities (only 6 per page)
    quantities: model.getSearchResultsPage(goToPage, model.getKeysArr(model.state.ingredient.results, 'strMeasure'), model.state.ingredient.resultsPerPage),
    page: model.state.ingredient.page,
    resultsPerPage: model.state.ingredient.resultsPerPage,
    allIngredients: model.getKeysArr(model.state.ingredient.results, 'strIngredient'),
    id: model.state.ingredient.id
  };
};

var controlIngredient = function controlIngredient(website) {
  window.open(website, 'Youtube_WindowName');
};

var controlImages = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(foodID) {
    var objToRender, check;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return model.loadFoodIng(foodID);

          case 2:
            // 2) Hide foodsView
            _foodsView.default.hideWindow(); // 3) Show Ingredient View
            // Making Object to send to render


            objToRender = makeIngObject(1);
            check = model.state.bookmarks.entries.some(function (entry) {
              return entry.id === objToRender.id;
            });
            if (check) objToRender.isBookmarked = true;else objToRender.isBookmarked = false;

            _ingredientView.default.render(objToRender); // 4) Add Pagination buttons


            _paginationIngredientView.default.render(objToRender, true, false);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function controlImages(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var controlIngPagination = function controlIngPagination(goToPage) {
  if (goToPage === 'fa-bookmark-o') {
    var _objToRender = makeIngObject(1);

    model.toggleBookmark(_objToRender);

    _ingredientView.default.render(_objToRender);

    _paginationIngredientView.default.render(_objToRender, true, false);

    return;
  }

  if (goToPage === 'fa-bookmark') {
    var _objToRender2 = makeIngObject(1);

    var _check = model.state.bookmarks.entries.some(function (entry) {
      return entry.id === _objToRender2.id;
    });

    if (_check) _objToRender2.isBookmarked = true;else _objToRender2.isBookmarked = false;
    model.toggleBookmark(_objToRender2);

    _ingredientView.default.render(_objToRender2);

    _paginationIngredientView.default.render(_objToRender2, true, false);

    return;
  }

  goToPage = model.state.ingredient.page + model.getNewPageNumber(goToPage);
  model.state.ingredient.page = goToPage;
  var objToRender = makeIngObject(2); // Check if that ingredient exist in booksmarks

  var check = model.state.bookmarks.entries.some(function (entry) {
    return entry.id === objToRender.id;
  });
  if (check) objToRender.isBookmarked = true;else objToRender.isBookmarked = false;

  _ingredientView.default.render(objToRender);

  _paginationIngredientView.default.render(objToRender, true, false);
};

var controlNavigation = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(navStr) {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = navStr;
            _context3.next = _context3.t0 === 'categ' ? 3 : _context3.t0 === 'luck' ? 9 : _context3.t0 === 'bookmark' ? 15 : _context3.t0 === 'about' ? 20 : 26;
            break;

          case 3:
            _context3.next = 5;
            return model.loadCategories();

          case 5:
            _categoriesView.default.render(model.getSearchResultsPage(1, model.state.search.results));

            _ingredientView.default.hideWindow();

            _paginationFoodView.default.render(model.state.search);

            return _context3.abrupt("break", 27);

          case 9:
            _context3.next = 11;
            return model.loadLucky();

          case 11:
            // 2) Hide Ingredient View (if there is)
            _ingredientView.default.hideWindow(); // 3) Render Results


            _foodsView.default.render(model.getSearchResultsPage()); // 4) Render Buttons


            _paginationFoodView.default.render(model.state.search);

            return _context3.abrupt("break", 27);

          case 15:
            // 1) Setting page to 1 when clicked on bookmark button
            model.state.bookmarks.page = 1; // 2) Hiding ingredientView window (if there is)

            _ingredientView.default.hideWindow(); // 3) Render Results


            _bookmarkView.default.render(model.getBookmarkPage()); // 4) Render Buttons


            _paginationFoodView.default.render(model.state.bookmarks);

            return _context3.abrupt("break", 27);

          case 20:
            _ingredientView.default.hideWindow();

            _foodsView.default.hideWindow();

            model.state.search.context = 'about';

            _aboutView.default.render();

            _paginationFoodView.default.render(model.state.search);

            return _context3.abrupt("break", 27);

          case 26:
            console.error('Unknown nav');

          case 27:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function controlNavigation(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var controlCategories = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(category) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return model.loadCategorySearch(category);

          case 2:
            // 2) Hide Category View
            _categoriesView.default.hideWindow(); // 3) Show Food View


            _foodsView.default.render(model.getSearchResultsPage()); // 4) Render Buttons


            _paginationFoodView.default.render(model.state.search);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function controlCategories(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

var controlAbout = function controlAbout(site) {
  if (site === 'github') {
    var website = 'https://github.com/tom-motiejunas/tom-motiejunas';
    window.open(website, 'Github_WindowName');
  }

  if (site === 'linkedin') {
    var _website = 'https://www.linkedin.com/in/tomas-motiej%C5%ABnas-5974861b9/';
    window.open(_website, 'Linkedin_WindowName');
  }
};

var init = function init() {
  _searchView.default.addHandlerSearch(controlSearch);

  _paginationFoodView.default.addHandlerClick(controlFoodPagination);

  _foodsView.default.addHandlerClick(controlImages);

  _paginationIngredientView.default.addHandlerClick(controlIngPagination);

  _navView.default.addHandlerClick(controlNavigation);

  _categoriesView.default.addHandlerClick(controlCategories);

  _ingredientView.default.addHandlerClick(controlIngredient);

  _aboutView.default.addHandlerClick(controlAbout);
};

init();
},{"./model.js":"src/js/model.js","./views/foodsView.js":"src/js/views/foodsView.js","./views/ingredientView.js":"src/js/views/ingredientView.js","./views/navView.js":"src/js/views/navView.js","./views//pagination/paginationFoodView.js":"src/js/views/pagination/paginationFoodView.js","./views/searchView.js":"src/js/views/searchView.js","./views/pagination/paginationIngredientView.js":"src/js/views/pagination/paginationIngredientView.js","./views/categoriesView.js":"src/js/views/categoriesView.js","regenerator-runtime":"node_modules/regenerator-runtime/runtime.js","./views/bookmarkView.js":"src/js/views/bookmarkView.js","./views/aboutView.js":"src/js/views/aboutView.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51535" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/controller.js"], null)
//# sourceMappingURL=/controller.e87f5190.js.map