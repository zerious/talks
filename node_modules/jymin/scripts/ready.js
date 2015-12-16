/**
 * Execute a function when the page loads or new content is added.
 *
 * @param  {Function}  listener  A function which will receive a ready element.
 */
Jymin.ready = function (object, listener) {
  if (!listener) {
    listener = object
    object = document
  }

  // If the object is alreay ready, run the function now.
  if (object._isReady) {
    listener(object)
  }

  // Create a function that replaces itself so it will only run once.
  var fn = function () {
    if (Jymin.isReady(object)) {
      Jymin.isReady(object, 1)
      listener(object)
      listener = Jymin.no
    }
  }

  // Bind using multiple methods for a variety of browsers.
  Jymin.on(object, 'readystatechange,DOMContentLoaded', fn)
  Jymin.on(object === document ? window : object, 'load', fn)

  // Bind to the Jymin-triggered ready event.
  Jymin.on(object, '_ready', fn)
}

/**
 * Get or set the readiness status of an object.
 *
 * @param  {Object}  object    The object that might be ready.
 * @param  {Boolean} setReady  Whether to .
 * @return {Boolean}           Whether the object is currently ready.
 */
Jymin.isReady = function (object, setReady) {
  // Declare an object to be ready, and run events that have been bound to it.
  if (setReady && !object._ready) {
    object._ready = true
    Jymin.emit('_ready', object)
  }
  // AJAX requests have readyState 4 when loaded.
  // All documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  return object._ready || /(4|complete|scriptloaded)$/.test('' + object.tagName + object.readyState)
}
