/**
 * Event Handlers
 * @type {Object}
 */
Jymin.handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Jymin.on = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var element = Jymin.isString(selectorOrElement) ? document : selectorOrElement
  Jymin.each(eventTypes, function (eventType) {
    var handlers = Jymin.handlers[eventType]
    if (!handlers) {
      handlers = Jymin.handlers[eventType] = []
      if (element.addEventListener) {
        element.addEventListener(eventType, Jymin.emit, false)
      } else if (element.attachEvent) {
        element.attachEvent('on' + eventType, Jymin.emit)
      } else {
        element['on' + eventType] = Jymin.emit
      }
    }
    handlers.push([selectorOrElement, listener])
  })
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String|Array} eventType   An event to stop listening for.
 * @param  {Function}     listener    A listener function to remove.
 */
Jymin.off = function (eventType, listener) {
  var handlers = Jymin.handlers[eventType]
  var index = handlers.indexOf(listener)
  if (index > -1) {
    handlers.splice(index, 1)
  }
}

/**
 * Listen for one or more events just once, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Jymin.once = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var fn = function (element, event, type) {
    listener(element, event, type)
    Jymin.off(type, fn)
  }
  Jymin.on(selectorOrElement, eventTypes, fn)
}

/**
 * Simulate an event, or propagate an event up the DOM.
 *
 * @param  {String|Object} event   An event or event type to propagate.
 * @param  {HTMLElement}   target  An optional target to start propagation from.
 * @param  {Object}        data    Optional data to report with the event.
 */
Jymin.emit = function (event, target, data) {

  // Get the window-level event if an event isn't passed.
  event = event || window.event

  // Construct an event object if necessary.
  if (Jymin.isString(event)) {
    event = {type: event}
  }

  // Reference an element if possible.
  var element = event.target = target || event.target || event.srcElement || document

  // Extract the event type.
  var type = event.type

  var handlers = Jymin.handlers[type]
  while (element && !event._stopped) {
    Jymin.each(handlers, function (handler) {
      var selector = handler[0]
      var fn = handler[1]
      var isMatch = Jymin.isString(selector) ?
        Jymin.matches(element, selector) :
        (element === selector)
      if (isMatch) {
        fn(data || element, event, type)
      }
      return !event._stopped
    })
    if (element === document) {
      break
    }
    element = Jymin.parent(element)
  }
}

/**
 * Find out if an element matches a given selector.
 *
 * @param  {HTMLElement} element   An element to pretend the event occurred on.
 * @param  {String}      selector  A CSS selector to check against an element.
 * @return {boolean}               True if the element (this) matches the selector.
 */
Jymin.matches = function (element, selector, type) {
  var self = this
  var matches =
    element.webkitMatchesSelector ||
    element.msMatchesSelector ||
    element.mozMatchesSelector ||
    element.oMatchesSelector ||
    element.matchesSelector ||
    element.matches || Jymin.no
  var isMatch = matches.call(element, selector)
  return isMatch
}

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Jymin.preventDefault = function (event) {
  Jymin.apply(event, 'preventDefault')
}

/**
 * Stop an event from bubbling or performing its default action.
 *
 * @param  {Event} event  Event to stop.
 */
Jymin.stopEvent = function (event) {
  event._stopped = 1
  Jymin.preventDefault(event)
}

/**
 * Focus on a specified element.
 *
 * @param  {HTMLElement} element  The element to focus on.
 */
Jymin.focusElement = function (element) {
  Jymin.apply(element, 'focus')
}
