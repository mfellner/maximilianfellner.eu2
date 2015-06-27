import Rx from 'rx';

const Observables = {};

/**
 * Converts a callback function to an observable sequence.
 *
 * An alternative to Rx.Observable.fromCallback that does
 * not call onComplete, which allows Subscribers of the
 * Observable to receive multiple callback events.
 *
 * @param fn {Function} Function with a callback as the last parameter to
 *                      convert to an Observable sequence.
 *
 * @param context {Object} The context for the func parameter to be executed.
 *                         If not specified, defaults to undefined.
 *
 * @param selector {Function} A selector which takes the arguments from the
 *                            callback to produce a single item to yield on
 *                            next.
 *
 * @returns {Function} A function, when executed with the required parameters
 *                     minus the callback, produces an Observable sequence with
 *                     a single value of the arguments to the callback as an
 *                     array if no selector given, else the object created by
 *                     the selector function.
 */
Observables.fromCallback = (fn, context = undefined, selector = null) => {
  return function () {
    const fnArgs = Array.prototype.slice.call(arguments);
    return Rx.Observable.create(observer => {
      const callbackHandler = function () {
        const arg = typeof selector === 'function'
          ? selector.apply(context, arguments)
          : arguments.length === 1 ? arguments[0] : arguments;
        observer.onNext(arg);
      };
      fn.apply(context, fnArgs.concat(callbackHandler));
    });
  };
};

export default Observables;
