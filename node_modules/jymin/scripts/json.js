/**
 * Create a circular-safe JSON string.
 */
Jymin.safeStringify = function (data, quote, stack) {
  if (Jymin.isString(data)) {
    data = quote + data.replace(/\n\r"'/g, function (c) {
      return c === '\n' ? '\\n' : c === '\r' ? '\\r' : c === quote ? '\\' + c : c === '"' ? '&quot;' : "'"
    }) + quote
  } else if (Jymin.isFunction(data) || Jymin.isUndefined(data)) {
    return null
  } else if (data && Jymin.isObject(data)) {
    stack = stack || []
    var isCircular
    Jymin.each(stack, function (item) {
      if (item === data) {
        isCircular = 1
      }
    })
    if (isCircular) {
      return null
    }
    stack.push(data)
    var parts = []
    var before, after
    if (Jymin.isArray(data)) {
      before = '['
      after = ']'
      Jymin.each(data, function (value) {
        parts.push(Jymin.safeStringify(value, quote, stack))
      })
    } else {
      before = '{'
      after = '}'
      Jymin.each(data, function (value, key) {
        parts.push(Jymin.stringify(key) + ':' + Jymin.safeStringify(value, stack))
      })
    }
    stack.pop()
    data = before + parts.join(',') + after
  } else {
    data = '' + data
  }
  return data
}

/**
 * Create a JSON string.
 */
//+browser:old
Jymin.stringify = Jymin.safeStringify
//-browser:old
//+browser:ok
Jymin.stringify = JSON.stringify
//-browser:ok

/**
 * Create a JSON-ish string.
 */
Jymin.attrify = function (data) {
  return Jymin.safeStringify(data, "'")
}

/**
 * Parse JavaScript and return a value.
 */
Jymin.parse = function (value, alternative) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value)
    value = evil.J
  } catch (e) {
    //+env:debug
    Jymin.error('[Jymin] Could not parse JS: ' + value)
    //-env:debug
    value = alternative
  }
  return value
}

/**
 * Execute JavaScript.
 */
Jymin.execute = function (text) {
  Jymin.parse('0;' + text)
}

/**
 * Parse a value and return a boolean no matter what.
 */
Jymin.parseBoolean = function (value, alternative) {
  value = Jymin.parse(value)
  return Jymin.isBoolean(value) ? value : (alternative || false)
}

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseNumber = function (value, alternative) {
  value = Jymin.parse(value)
  return Jymin.isNumber(value) ? value : (alternative || 0)
}

/**
 * Parse a value and return a string no matter what.
 */
Jymin.parseString = function (value, alternative) {
  value = Jymin.parse(value)
  return Jymin.isString(value) ? value : (alternative || '')
}

/**
 * Parse a value and return an object no matter what.
 */
Jymin.parseObject = function (value, alternative) {
  value = Jymin.parse(value)
  return Jymin.isObject(value) ? value : (alternative || {})
}

/**
 * Parse a value and return a number no matter what.
 */
Jymin.parseArray = function (value, alternative) {
  value = Jymin.parse(value)
  return Jymin.isObject(value) ? value : (alternative || [])
}
