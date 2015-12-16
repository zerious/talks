// When not in debug mode, make the logging functions do nothing.
Jymin.error = Jymin.no
Jymin.warn = Jymin.no
Jymin.info = Jymin.no
Jymin.log = Jymin.no
Jymin.trace = Jymin.no

//+env:debug

/**
 * Log values to the console, if it's available.
 */
Jymin.error = function () {
  Jymin.ifConsole('error', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Jymin.warn = function () {
  Jymin.ifConsole('warn', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Jymin.info = function () {
  Jymin.ifConsole('info', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Jymin.log = function () {
  Jymin.ifConsole('log', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Jymin.trace = function () {
  Jymin.ifConsole('trace', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Jymin.ifConsole = function (method, args) {
  var console = window.console
  if (console && console[method]) {
    console[method].apply(console, args)
  }
}

//-env:debug
