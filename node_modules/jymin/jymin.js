/**      _                 _                ___   ____   ___
 *      | |_   _ _ __ ___ (_)_ __   __   __/ _ \ | ___| / _ \
 *   _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | ||___ \| | | |
 *  | |_| | |_| | | | | | | | | | |  \ V /| |_| | ___) | |_| |
 *   \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_)____(_)___/
 *         |___/
 *
 * http://lighter.io/jymin
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/lighterio/jymin/blob/master/scripts/ajax.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/charts.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/collections.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/cookies.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/crypto.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dates.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dom.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/emitter.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/events.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/forms.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/functions.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/head.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/history.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/i18n.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/json.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/logging.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/move.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/numbers.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/ready.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/regexp.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/storage.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/strings.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/timing.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/types.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/url.js
 */


var Jymin = {version: '0.5.0'};

//+env:commonjs
// Support CommonJS.
if (typeof exports === 'object') {
  module.exports = Jymin;
}
//-env:commonjs

//+env:amd
// Support AMD.
else if (typeof define === 'function' && define.amd) {
  define(function() {
    return Jymin;
  });
}
//-env:amd

//+env:window
// Support browsers.
else {
  this.Jymin = Jymin;
}
//-env:window

/**
 * Empty handler.
 * @type {function}
 */
Jymin.no = function () {}

/**
 * Default AJAX success handler function.
 * @type {function}
 */
Jymin.ok = Jymin.no

/**
 * Default AJAX failure handler function.
 * @type {function}
 */
Jymin.fail = Jymin.no

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
Jymin.xhr = function () {
  var xhr


  xhr = new XMLHttpRequest()

  return xhr
}

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}   The request upload object.
 */
Jymin.upload = function () {
  var xhr = Jymin.xhr()
  return xhr ? xhr.upload : false
}

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {string}   url   A URL from which to request a response.
 * @param  {string}   data  An optional query, which if provided, makes the request a POST.
 * @param  {function} ok    An optional function to run upon success.
 * @param  {function} fail  An optional function to run upon failure.
 */
Jymin.get = function (url, data, ok, fail) {
  // If the optional data argument is omitted, zero it.
  if (Jymin.isFunction(data)) {
    fail = ok
    ok = data
    data = 0
  }
  var request = Jymin.xhr()
  if (request) {
    ok = ok || Jymin.ok
    fail = fail || Jymin.fail
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        var status = request.status
        var isSuccess = (status === 200)
        var fn = isSuccess ? (ok || Jymin.ok) : (fail || Jymin.fail)
        var data = Jymin.parse(request.responseText) || {}
        fn(data, request, status)
      }
    }
    request.open(data ? 'POST' : 'GET', url, true)
    if (data) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      if (Jymin.isObject(data)) {
        data = 'json=' + Jymin.escape(Jymin.stringify(data))
      }
    }
    request.send(data || null)
  }
}
/**
 * Get 100 consistent colors for charting.
 * These colors are designed to maximize visual distance.
 *
 * @return {Array}   The request object.
 */
Jymin.getChartColors = function () {
  var colors = Jymin.getChartColors._cache
  if (!colors) {
    var map = {}
    var string =
      '03f290c00eb0b0f0cbe6000605090307bf0c740f7a07f' +
      '686f97a098a0748f05a200a772d6332300b1708014dc0' +
      'c89f7a0ff045faf78304ab9798eb804020fcfd5600089' +
      '9f574be6f0f7f6405'
    colors = []
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 35; j++) {
        var color = string.substr(j * 3 + i, 3)
        if (!map[color]) {
          map[color] = 1
          colors.push('#' + color)
        }
      }
    }
    Jymin.getChartColors._cache = colors
  }
  return colors
}
/**
 * Iterate over an object or array, calling a function on each value.
 * If the function returns false, stop iterating.
 *
 * - For arrays, the function arguments are: (value, index, collection).
 * - For objects, the arguments are: (key, value, collection).
 *
 * @param  {Array|Object|string}  collection  A collection of items.
 * @param  {Function}             fn          A function to call on each item.
 * @return {Number}                           Index or key that returned false.
 */
Jymin.each = function (collection, fn) {
  if (collection) {
    collection = Jymin.isString(collection) ? Jymin.splitByCommas(collection) : collection
    var length = collection.length
    var key, result
    if (Jymin.isNumber(length)) {
      for (key = 0; key < length; key++) {
        result = fn(collection[key], key, collection)
        if (result === false) {
          break
        }
      }
    } else {
      for (key in collection) {
        result = fn(collection[key], key, collection)
        if (result === false) {
          break
        }
      }
    }
    return key
  }
}

/**
 * Decorate an object with properties from another object.
 */
Jymin.decorate = function (object, decorations) {
  if (object) {
    Jymin.each(decorations, function (value, key) {
      object[key] = value
    })
  }
  return object
}

/**
 * Return a property if it is defined, otherwise set and return a default if provided.
 */
Jymin.prop = function (object, property, defaultValue) {
  var value = object[property]
  if (!Jymin.isDefined(value)) {
    value = object[property] = defaultValue
  }
  return value
}


/**
 * Return the subset of an array for which a filter function returns truthy.
 *
 * @param  {Array|Object|string}  array  An array to filter.
 * @param  {Function}             fn     A filter function.
 * @return {Array}          [description]
 */
Jymin.filter = function (array, fn) {
  var filtered = []
  Jymin.each(array, function (item) {
    if (fn(item)) {
      filtered.push(item)
    }
  })
  return filtered
}

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @params {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
Jymin.merge = function (array) {
  Jymin.each(arguments, function (items, index) {
    if (index) {
      [].push.apply(array, items)
    }
  })
  return array
}
/**
 * Get all cookies from the document, and return a map.
 *
 * @return {Object}  The map of cookie names and values.
 */
Jymin.getAllCookies = function () {
  var obj = {}
  var documentCookie = Jymin.trim(document.cookie)
  if (documentCookie) {
    var cookies = documentCookie.split(/\s*;\s*/)
    Jymin.each(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/)
      obj[Jymin.unescape(pair[0])] = Jymin.unescape(pair[1])
    })
  }
  return obj
}

/**
 * Get a cookie by its name.
 *
 * @param  {String} name  A cookie name.
 * @return {String}       The cookie value.
 */
Jymin.getCookie = function (name) {
  return Jymin.getAllCookies()[name]
}

/**
 * Set or overwrite a cookie value.
 *
 * @param {String} name     A cookie name, whose value is to be set.
 * @param {Object} value    A value to be set as a string.
 * @param {Object} options  Optional cookie options, including "maxage", "expires", "path", "domain" and "secure".
 */
Jymin.setCookie = function (name, value, options) {
  options = options || {}
  var str = Jymin.escape(name) + '=' + Jymin.unescape(value)
  if (null === value) {
    options.maxage = -1
  }
  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage)
  }
  document.cookie = str
    + (options.path ? ';path=' + options.path : '')
    + (options.domain ? ';domain=' + options.domain : '')
    + (options.expires ? ';expires=' + options.expires.toUTCString() : '')
    + (options.secure ? ';secure' : '')
}

/**
 * Delete a cookie by name.
 *
 * @param {String} name  A cookie name, whose value is to be deleted.
 */
Jymin.deleteCookie = function (name) {
  Jymin.setCookie(name, null)
}
/**
 * Calculate an MD5 hash for a string (useful for things like Gravatars).
 *
 * @param  {String} s  A string to hash.
 * @return {String}    The MD5 hash for the given string.
 */
Jymin.md5 = function (str) {

  // Encode as UTF-8.
  str = decodeURIComponent(encodeURIComponent(str))

  // Build an array of little-endian words.
  var arr = new Array(str.length >> 2)
  for (var idx = 0, len = arr.length; idx < len; idx += 1) {
    arr[idx] = 0
  }
  for (idx = 0, len = str.length * 8; idx < len; idx += 8) {
    arr[idx >> 5] |= (str.charCodeAt(idx / 8) & 0xFF) << (idx % 32)
  }

  // Calculate the MD5 of an array of little-endian words.
  arr[len >> 5] |= 0x80 << (len % 32)
  arr[(((len + 64) >>> 9) << 4) + 14] = len

  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  len = arr.length
  idx = 0
  while (idx < len) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    var e = arr[idx++]
    var f = arr[idx++]
    var g = arr[idx++]
    var h = arr[idx++]
    var i = arr[idx++]
    var j = arr[idx++]
    var k = arr[idx++]
    var l = arr[idx++]
    var m = arr[idx++]
    var n = arr[idx++]
    var o = arr[idx++]
    var p = arr[idx++]
    var q = arr[idx++]
    var r = arr[idx++]
    var s = arr[idx++]
    var t = arr[idx++]

    a = ff(a, b, c, d, e, 7, -680876936)
    d = ff(d, a, b, c, f, 12, -389564586)
    c = ff(c, d, a, b, g, 17, 606105819)
    b = ff(b, c, d, a, h, 22, -1044525330)
    a = ff(a, b, c, d, i, 7, -176418897)
    d = ff(d, a, b, c, j, 12, 1200080426)
    c = ff(c, d, a, b, k, 17, -1473231341)
    b = ff(b, c, d, a, l, 22, -45705983)
    a = ff(a, b, c, d, m, 7, 1770035416)
    d = ff(d, a, b, c, n, 12, -1958414417)
    c = ff(c, d, a, b, o, 17, -42063)
    b = ff(b, c, d, a, p, 22, -1990404162)
    a = ff(a, b, c, d, q, 7, 1804603682)
    d = ff(d, a, b, c, r, 12, -40341101)
    c = ff(c, d, a, b, s, 17, -1502002290)
    b = ff(b, c, d, a, t, 22, 1236535329)

    a = gg(a, b, c, d, f, 5, -165796510)
    d = gg(d, a, b, c, k, 9, -1069501632)
    c = gg(c, d, a, b, p, 14, 643717713)
    b = gg(b, c, d, a, e, 20, -373897302)
    a = gg(a, b, c, d, j, 5, -701558691)
    d = gg(d, a, b, c, o, 9, 38016083)
    c = gg(c, d, a, b, t, 14, -660478335)
    b = gg(b, c, d, a, i, 20, -405537848)
    a = gg(a, b, c, d, n, 5, 568446438)
    d = gg(d, a, b, c, s, 9, -1019803690)
    c = gg(c, d, a, b, h, 14, -187363961)
    b = gg(b, c, d, a, m, 20, 1163531501)
    a = gg(a, b, c, d, r, 5, -1444681467)
    d = gg(d, a, b, c, g, 9, -51403784)
    c = gg(c, d, a, b, l, 14, 1735328473)
    b = gg(b, c, d, a, q, 20, -1926607734)

    a = hh(a, b, c, d, j, 4, -378558)
    d = hh(d, a, b, c, m, 11, -2022574463)
    c = hh(c, d, a, b, p, 16, 1839030562)
    b = hh(b, c, d, a, s, 23, -35309556)
    a = hh(a, b, c, d, f, 4, -1530992060)
    d = hh(d, a, b, c, i, 11, 1272893353)
    c = hh(c, d, a, b, l, 16, -155497632)
    b = hh(b, c, d, a, o, 23, -1094730640)
    a = hh(a, b, c, d, r, 4, 681279174)
    d = hh(d, a, b, c, e, 11, -358537222)
    c = hh(c, d, a, b, h, 16, -722521979)
    b = hh(b, c, d, a, k, 23, 76029189)
    a = hh(a, b, c, d, n, 4, -640364487)
    d = hh(d, a, b, c, q, 11, -421815835)
    c = hh(c, d, a, b, t, 16, 530742520)
    b = hh(b, c, d, a, g, 23, -995338651)

    a = ii(a, b, c, d, e, 6, -198630844)
    d = ii(d, a, b, c, l, 10, 1126891415)
    c = ii(c, d, a, b, s, 15, -1416354905)
    b = ii(b, c, d, a, j, 21, -57434055)
    a = ii(a, b, c, d, q, 6, 1700485571)
    d = ii(d, a, b, c, h, 10, -1894986606)
    c = ii(c, d, a, b, o, 15, -1051523)
    b = ii(b, c, d, a, f, 21, -2054922799)
    a = ii(a, b, c, d, m, 6, 1873313359)
    d = ii(d, a, b, c, t, 10, -30611744)
    c = ii(c, d, a, b, k, 15, -1560198380)
    b = ii(b, c, d, a, r, 21, 1309151649)
    a = ii(a, b, c, d, i, 6, -145523070)
    d = ii(d, a, b, c, p, 10, -1120210379)
    c = ii(c, d, a, b, g, 15, 718787259)
    b = ii(b, c, d, a, n, 21, -343485551)

    a = add(a, olda)
    b = add(b, oldb)
    c = add(c, oldc)
    d = add(d, oldd)
  }
  arr = [a, b, c, d]

  // Build a string.
  var hex = '0123456789abcdef'
  str = ''
  for (idx = 0, len = arr.length * 32; idx < len; idx += 8) {
    var code = (arr[idx >> 5] >>> (idx % 32)) & 0xFF
    str += hex.charAt((code >>> 4) & 0x0F) + hex.charAt(code & 0x0F)
  }

  return str

  /**
   * Add 32-bit integers, using 16-bit operations to mitigate JS interpreter bugs.
   */
  function add (a, b) {
    var lsw = (a & 0xFFFF) + (b & 0xFFFF)
    var msw = (a >> 16) + (b >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  function cmn (q, a, b, x, s, t) {
    a = add(add(a, q), add(x, t))
    return add((a << s) | (a >>> (32 - s)), b)
  }

  function ff (a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }

  function gg (a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }

  function hh (a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
  }

  function ii (a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

}
/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param {Date}    date  An optional Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
Jymin.getTime = function (date) {
  return date ? date.getTime() : Date.now()
}

/**
 * Get an ISO-standard date string.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
Jymin.getIsoDate = function (date) {
  date = date || new Date()

  date = date.toISOString()


  return date
}

/**
 * Take a date and return a formatted date string in long or short format:
 * - Short: "8/26/14 7:42pm"
 * - Long: "August 26, 2014 at 7:42pm"
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @param  {Boolean} isLong  Whether to output the short or long format.
 * @param  {Boolean} isTime  Whether to append the time.
 * @return {String}          The formatted date string.
 */
Jymin.formatDate = function (date, isLong, isTime) {
  if (!Jymin.isDate(date)) {
    date = new Date(+date || date)
  }
  var m = date.getMonth()
  var day = date.getDate()
  var y = date.getFullYear()
  if (isLong) {
    m = Jymin.i18nMonths[m]
  } else {
    m++
    y = ('' + y).substr(2)
  }
  var isAm = 1
  var hour = +date.getHours()
  var minute = date.getMinutes()
  minute = minute > 9 ? minute : '0' + minute
  if (!Jymin.i18n24Hour) {
    if (hour > 12) {
      isAm = 0
      hour -= 12
    } else if (!hour) {
      hour = 12
    }
  }
  var string
  if (Jymin.i18nDayMonthYear) {
    string = m
    m = day
    day = string
  }
  if (isLong) {
    string = m + ' ' + day + ', ' + y
  } else {
    string = m + '/' + day + '/' + y
  }
  if (isTime) {
    if (isLong) {
      string += ' ' + Jymin.i18nAt
    }
    string += ' ' + hour + ':' + minute
    if (Jymin.i18n24Hour) {
      string += (isAm ? 'am' : 'pm')
    }
  }
  return string
}

/**
 * Taka a date object and return a formatted time string.
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @return {[type]}
 */
Jymin.formatTime = function (date) {
  date = Jymin.formatDate(date).replace(/^.* /, '')
}
/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {HTMLElement}        parentElement  Optional element to call getElementById on (default: document).
 * @param  {string|HTMLElement} idOrElement    ID of an element, or the element itself.
 * @return {HTMLElement}                       The matching element, or undefined.
 */
Jymin.byId = function (parentElement, idOrElement) {
  if (!idOrElement) {
    idOrElement = parentElement
    parentElement = document
  }
  return Jymin.isString(idOrElement) ? parentElement.getElementById(idOrElement) : idOrElement
}

/**
 * Get or set the parent of an element.
 *
 * @param  {HTMLElement} element    A element whose parent we want to get/set.
 * @param  {String}      parent     An optional parent to add the element to.
 * @param  {String}      before     An optional child to insert the element before.
 * @return {HTMLElement}            The parent of the element.
 */
Jymin.parent = function (element, parent, before) {
  if (parent) {
    parent.insertBefore(element, before || null)
  } else {
    parent = element.parentNode
  }
  return parent
}

/**
 * Get an element's ancestors, optionally filtered by a selector.
 *
 * @param  {HTMLElement} element   An element to start from.
 * @param  {String}      selector  An optional selector to filter ancestors.
 * @return {Array}                 The array of ancestors.
 */
Jymin.up = function (element, selector) {
  var ancestors = []
  while (element = Jymin.parent(element)) { // jshint ignore:line
    ancestors.push(element)
  }
  ancestors = Jymin.filter(ancestors, function (element) {
    return Jymin.matches(element, selector)
  })
  return ancestors
}

/**
 * Get the children of a parent element.
 *
 * @param  {HTMLElement}    element  A parent element who might have children.
 * @return {HTMLCollection}          The collection of children.
 */
Jymin.children = function (element) {
  return element.childNodes
}

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {HTMLElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
Jymin.index = function (element) {
  var index = -1
  while (element) {
    ++index
    element = element.previousSibling
  }
  return index
}

/**
 * Create a cloneable element with a specified tag name.
 *
 * @param  {String}      tagName  An optional tag name (default: div).
 * @return {HTMLElement}          The newly-created DOM Element with the specified tag name.
 */
Jymin.createTag = function (tagName) {
  tagName = tagName || 'div'
  var isSvg = /^(svg|g|path|circle|line)$/.test(tagName)
  var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml')
  return document.createElementNS(uri, tagName)
}

/**
 * Create an element, given a specified tag identifier.
 *
 * Identifiers are of the form:
 *   tagName#id.class1.class2?attr1=value1&attr2=value2
 *
 * Each part of the identifier is optional.
 *
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The existing or created element.
 */
Jymin.create = function (elementOrString, innerHtml) {
  var element = elementOrString
  if (Jymin.isString(elementOrString)) {
    var tagAndAttributes = elementOrString.split('?')
    var tagAndClass = tagAndAttributes[0].split('.')
    var className = tagAndClass.slice(1).join(' ')
    var tagAndId = tagAndClass[0].split('#')
    var tagName = tagAndId[0]
    var id = tagAndId[1]
    var attributes = tagAndAttributes[1]
    var cachedElement = Jymin.createTag[tagName] || (Jymin.createTag[tagName] = Jymin.createTag(tagName))
    element = cachedElement.cloneNode(true)
    if (id) {
      element.id = id
    }
    if (className) {
      element.className = className
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&')
      Jymin.each(attributes, function (attribute) {
        var keyAndValue = attribute.split('=')
        var key = keyAndValue[0]
        var value = keyAndValue[1]
        element[key] = value
        Jymin.setAttribute(element, key, value)
      })
    }
    if (innerHtml) {
      Jymin.html(element, innerHtml)
    }
  }
  return element
}

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The element that was added.
 */
Jymin.add = function (parentElement, elementOrString, innerHtml) {
  if (Jymin.isString(parentElement)) {
    elementOrString = parentElement
    parentElement = document.body
  }
  var element = Jymin.create(elementOrString, innerHtml)
  parentElement.appendChild(element)
  return element
}

/**
 * Insert a child element under a parent element, optionally before another element.
 *
 * @param  {HTMLElement}         parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {HTMLElement}         beforeSibling    An optional child to insert the element before.
 * @return {HTMLElement}                          The element that was inserted.
 */
Jymin.insert = function (parentElement, elementOrString, beforeSibling) {
  if (Jymin.isString(parentElement)) {
    beforeSibling = elementOrString
    elementOrString = parentElement
    parentElement = document.body
  }
  var element = Jymin.create(elementOrString)
  if (parentElement) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (Jymin.isNumber(beforeSibling)) {
      beforeSibling = Jymin.children(parentElement)[beforeSibling]
    }
    // Insert the element, optionally before an existing sibling.
    parentElement.insertBefore(element, beforeSibling || Jymin.getFirstChild(parentElement) || null)
  }
  return element
}

/**
 * Remove an element from its parent.
 *
 * @param  {HTMLElement} element  An element to remove.
 */
Jymin.remove = function (element) {
  if (element) {
    // Remove the element from its parent, provided that it has a parent.
    var parentElement = Jymin.parent(element)
    if (parentElement) {
      parentElement.removeChild(element)
    }
  }
}

/**
 * Get or set an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      html     An optional string of HTML to set as the innerHTML.
 * @return {String}               The element's HTML.
 */
Jymin.html = function (element, html) {
  if (!Jymin.isUndefined(html)) {
    element.innerHTML = html
  }
  return element.innerHTML
}

/**
 * Get an element's lowercase tag name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's tag name.
 */
Jymin.tag = function (element) {
  return Jymin.lower(element.tagName)
}

/**
 * Get or set the text of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to set.
 */
Jymin.text = function (element, text) {
  if (!Jymin.isUndefined(text)) {
    Jymin.html(element, '')
    Jymin.addText(element, text)
  }
  return element.textContent || element.innerText
}

/**
 * Add text to an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to add.
 */
Jymin.addText = function (element, text) {
  Jymin.add(element, document.createTextNode(text))
}

/**
 * Get an attribute from an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute's name.
 * @return {String}                     The value of the attribute.
 */
Jymin.getAttribute = function (element, attributeName) {
  return element.getAttribute(attributeName)
}

/**
 * Set an attribute on an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute name.
 * @param  {String}      value          A value to set the attribute to.
 */
Jymin.setAttribute = function (element, name, value) {
  if (value === null) {
    element.removeAttribute(name)
  } else {
    var old = Jymin.getAttribute(element, name)
    if (value !== old) {
      element.setAttribute(name, value)
    }
  }
}

/**
 * Get a data attribute from an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute's key.
 * @return {String}               The value of the data attribute.
 */
Jymin.getData = function (element, dataKey) {
  return Jymin.getAttribute(element, 'data-' + dataKey)
}

/**
 * Set a data attribute on an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute key.
 * @param  {String}      value    A value to set the data attribute to.
 */
Jymin.setData = function (element, dataKey, value) {
  Jymin.setAttribute(element, 'data-' + dataKey, value)
}

/**
 * Get an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's class name.
 */
Jymin.getClass = function (element) {
  var className = element.className || ''
  return className.baseVal || className
}

/**
 * Get an element's class name as an array of classes.
 *
 * @param  {HTMLElement} element  An element.
 * @return {Array}                The element's class name classes.
 */
Jymin.getClasses = function (element) {
  var classes = Jymin.getClass(element) || ''
  return classes.split(/\s+/)
}

/**
 * Set an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               One or more space-delimited classes to set.
 */
Jymin.setClass = function (element, className) {
  element.className = className
}

/**
 * Find out whether an element has a specified class.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to search for.
 * @return {boolean}                True if the class was found.
 */
Jymin.hasClass = function (element, className) {
  var classes = Jymin.getClasses(element)
  return classes.indexOf(className) > -1
}

/**
 * Add a class to a given element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}               A class to add if it's not already there.
 */
Jymin.addClass = function (element, className) {
  if (!Jymin.hasClass(element, className)) {
    element.className += ' ' + className
  }
}

/**
 * Remove a class from a given element, assuming no duplication.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               A class to remove.
 */
Jymin.removeClass = function (element, className) {
  var classes = Jymin.getClasses(element)
  var index = classes.indexOf(className)
  if (index > -1) {
    classes.splice(index, 1)
  }
  classes = classes.join(' ')
  Jymin.setClass(element, classes)
}

/**
 * Turn a class on or off on a given element.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to add or remove.
 * @param  {boolean}     flipOn     Whether to add, rather than removing.
 */
Jymin.flipClass = function (element, className, flipOn) {
  var method = flipOn ? Jymin.addClass : Jymin.removeClass
  method(element, className)
}

/**
 * Turn a class on if it's off, or off if it's on.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to toggle.
 * @return {boolean}                True if the class was turned on.
 */
Jymin.toggleClass = function (element, className) {
  var flipOn = !Jymin.hasClass(element, className)
  Jymin.flipClass(element, className, flipOn)
  return flipOn
}

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement}    parentElement  An optional element under which to find elements.
 * @param  {String}         selector       A simple selector for finding elements.
 * @param  {Function}       fn             An optional function to run on matching elements.
 * @return {HTMLCollection}                The matching elements (if any).
 */
Jymin.all = function (parentElement, selector, fn) {
  if (!selector || Jymin.isFunction(selector)) {
    fn = selector
    selector = parentElement
    parentElement = document
  }
  if (!parentElement) {
    parentElement = document
  }
  var elements


  elements = parentElement.querySelectorAll(selector)

  if (fn) {
    Jymin.each(elements, fn)
  }
  return elements
}

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @param  {Function}    fn             An optional function to run on a matching element.
 * @return {HTMLElement}                The matching element (if any).
 */
Jymin.one = function (parentElement, selector, fn) {
  if (!selector || Jymin.isFunction(selector)) {
    fn = selector
    selector = parentElement
    parentElement = document
  }
  var element


  element = parentElement.querySelector(selector)

  if (element && fn) {
    fn(element)
  }
  return element
}

/**
 * Push new HTML into one or more selected elements.
 *
 * @param  {String} html     A string of HTML.
 * @param  {String} selector An optional selector (default: "body").
 */
Jymin.pushHtml = function (html, selector) {
  var content = html
  selector = selector || 'body'

  if (selector === 'body') {
    content = (/<body\b.*?>(.*?)<\/body>/i.exec(html) || 0)[0] || html
  }

  // Set the HTML of an element.
  return Jymin.all(selector, function (element) {

    Jymin.startTime('virtual')
    var virtualDom = Jymin.create('m', content)
    Jymin.endTime('virtual')
    Jymin.startTime('diff')
    Jymin.diffDom(element, virtualDom)
    Jymin.endTime('diff')
    Jymin.isReady(element, 1)

    Jymin.setTimer(function () {
      Jymin.all(virtualDom, 'script', function (script) {
        script = Jymin.html(script)
        Jymin.execute(script)
      })
      Jymin.all('script', Jymin.remove)
    })

  })[0]
}

/**
 * Set HTML by DOM merging.
 *
 * @param  {HTMLElement} element  The element to merge HTML into.
 * @param  {String}      html     A string of HTML to merge.
 */
Jymin.diffHtml = function (element, html) {
  Jymin.startTime('virtual')
  var virtualDom = Jymin.create('p', html)
  Jymin.endTime('virtual')
  Jymin.startTime('diff')
  Jymin.diffDom(element, virtualDom)
  Jymin.endTime('diff')
}

/**
 * Merge children from a virtual DOM.
 *
 * @param  {HTMLElement} domNode     The DOM node to merge into.
 * @param  {HTMLElement} newNode     The virtual DOM to merge from.
 */
Jymin.diffDom = function (domNode, newNode, isTopLevel) {
  var domChild = domNode.firstChild || 0
  var newChild = newNode.firstChild || 0
  while (newChild) {
    var domTag = domChild.tagName
    var newTag = newChild.tagName
    var domNext = domChild.nextSibling || 0
    var newNext = newChild.nextSibling || 0
    if ((domTag !== newTag) || Jymin.lower(newTag) === 'svg') {
      domNode.insertBefore(newChild, domChild || null)
      if (domChild) {
        domNode.removeChild(domChild)
      }
      domChild = domNext
    } else {
      if (newTag) {
        Jymin.diffDom(domChild, newChild)
        Jymin.diffAttributes(domChild, newChild)
      } else {
        domChild.textContent = newChild.textContent
      }
      domChild = domNext
    }
    newChild = newNext
  }
  while (domChild) {
    domNext = domChild.nextSibling
    domNode.removeChild(domChild)
    domChild = domNext
  }
}

/**
 * Merge attributes from a virtual DOM.
 *
 * @param  {HTMLElement} domNode     The DOM node to merge into.
 * @param  {HTMLElement} newNode     The virtual DOM to merge from.
 */
Jymin.diffAttributes = function (domNode, newNode) {
  var map = {}
  Jymin.each([domNode, newNode], function (element, index) {
    Jymin.each(element.attributes, function (attribute) {
      if (attribute) {
        map[attribute.name] = index ? attribute.value : null
      }
    })
  })
  Jymin.each(map, function (value, name) {
    Jymin.setAttribute(domNode, name, value)
  })
}
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
/**
 * Get or set the value of a form element.
 *
 * @param  {HTMLElement} input     A form element.
 * @param  {String}      newValue  An optional new value for the element.
 * @return {String|Array}          A value or values to set on the form element.
 */
Jymin.value = function (input, newValue) {
  input = Jymin.byId(input)
  if (input) {
    var type = input.type[0]
    var value = input.value
    var checked = input.checked
    var options = input.options
    var setNew = !Jymin.isUndefined(newValue)
    if (type === 'c' || type === 'r') {
      if (setNew) {
        input.checked = newValue ? true : false
      } else {
        value = checked ? value : null
      }
    } else if (options) {
      if (setNew) {
        var selected = {}
        if (input.multiple) {
          newValue = Jymin.isArray(newValue) ? newValue : [newValue]
          Jymin.each(newValue, function (optionValue) {
            selected[optionValue] = 1
          })
        } else {
          selected[newValue] = 1
        }
        Jymin.each(options, function (option) {
          option.selected = !!selected[option.value]
        })
      } else {
        value = Jymin.value(options[input.selectedIndex])
      }
    } else if (setNew) {
      input.value = newValue
    }
    return value
  }
}
/**
 * Apply arguments to an object method.
 *
 * @param  {Object}          object      An object with methods.
 * @param  {string}          methodName  A method name, which may exist on the object.
 * @param  {Arguments|Array} args        An arguments object or array to apply to the method.
 * @return {Object}                      The result returned by the object method.
 */
Jymin.apply = function (object, methodName, args) {
  return ((object || 0)[methodName] || Jymin.no).apply(object, args)
}
/**
 * Get the head element from the document.
 */
Jymin.getHead = function () {
  var head = Jymin.all('head')[0]
  return head
}

/**
 * Get the body element from the document.
 */
Jymin.getBody = function () {
  var body = Jymin.all('body')[0]
  return body
}

/**
 * Insert an external JavaScript file.
 *
 * @param  {String}   src  A source URL of a script to insert.
 * @param  {function} fn   An optional function to run when the script loads.
 */
Jymin.js = function (src, fn) {
  var head = Jymin.getHead()
  var script = Jymin.add(head, 'script')
  if (fn) {
    Jymin.ready(script, fn)
  }
  script.async = 1
  script.src = src
}

/**
 * Insert CSS text to the page.
 *
 * @param  {String} css  CSS text to be inserted.
 */
Jymin.css = function (css) {

  // Allow CSS pixel sizes to be scaled using a window property.
  var zoom = window._zoom
  if (zoom && zoom > 1) {
    css = Jymin.zoomCss(css)
  }

  // Insert CSS into the document head.
  var head = Jymin.getHead()
  var style = Jymin.add(head, 'style?type=text/css', css)
  var sheet = style.styleSheet
  if (sheet) {
    sheet.cssText = css
  }
}

/**
 * Scale CSS pixel sizes using a window property.
 *
 * @param  {String} css  CSS text to be zoomed.
 */
Jymin.zoomCss = function (css) {
  var zoom = window._zoom || 1
  return css.replace(/([\.\d]+)px\b/g, function (match, n) {
    return Math.floor(n * zoom) + 'px'
  })
}
/**
 * Return a history object.
 */
Jymin.getHistory = function () {
  var history = window.history || {}
  Jymin.each(['push', 'replace'], function (key) {
    var fn = history[key + 'State']
    history[key] = function (href) {
      try {
        fn.apply(history, [null, null, href])
      } catch (e) {
        // TODO: Create a backward-compatible history push.
      }
    }
  })
  return history
}

/**
 * Push an item into the history.
 */
Jymin.historyPush = function (href) {
  Jymin.getHistory().push(href)
}

/**
 * Replace the current item in the history.
 */
Jymin.historyReplace = function (href) {
  Jymin.getHistory().replace(href)
}

/**
 * Go back.
 */
Jymin.historyPop = function () {
  Jymin.getHistory().back()
}

/**
 * Listen for a history change.
 */
Jymin.onHistoryPop = function (callback) {
  Jymin.on(window, 'popstate', callback)
}
/**
 * The values in this file can be overridden externally.
 * The default locale is US. Sorry, World.
 */

/**
 * Month names in English.
 * @type {Array}
 */
Jymin.i18nMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * The word "at" in English (for separating date & time).
 * @type {String}
 */
Jymin.i18nAt = 'at'

/**
 * Whether to show dates in DD/MM/YYYY format.
 * @type {Booly}
 */
Jymin.i18nDayMonthYear = 0

/**
 * Whether to show times in 24-hour format.
 * @type {Booly}
 */
Jymin.i18n24Hour = 0

/**
 * Why oh why did I have to learn different units than the rest of the world?
 * @type {String}
 */
Jymin.i18nTemperature = 'F'
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


Jymin.stringify = JSON.stringify


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
/**
 * Scroll the top of the page to a specified Y position.
 *
 * @param  {Integer} top  A specified Y position, in pixels.
 */
Jymin.scrollTop = function (top) {
  document.body.scrollTop = (document.documentElement || 0).scrollTop = top
}

/**
 * Scroll the top of the page to a specified named anchor.
 *
 * @param  {String} name  The name of an HTML anchor.
 * @return {String}
 */
Jymin.scrollToAnchor = function (name) {
  var offset = 0
  var element


  element = Jymin.all('a[name=' + name + ']')[0]

  while (element) {
    offset += element.offsetTop || 0
    element = element.offsetParent || 0
  }
  Jymin.scrollTop(offset - (document._menuOffset || 0))
}

/**
 * Set the units to be used for positioning.
 *
 * @param {String} unit  CSS positioning unit (px/em/rem).
 */
Jymin.setUnit = function (unit) {
  Jymin.setUnit._unit = unit
}

/**
 * Get the width and height of an element.
 *
 * @param  {HTMLElement} element  Element to measure.
 */
Jymin.size = function (element) {
  element = element || 0
  return [element.offsetWidth, element.offsetHeight]
}

/**
 * Move, and potentially re-size, an element.
 *
 * @param  {HTMLElement} element  Element to move.
 * @param  {Number}      left     New left position for the element.
 * @param  {Number}      top      New top position for the element.
 * @param  {Number}      width    New width for the element.
 * @param  {Number}      height   New height for the element.
 * @param  {String}      unit     An optional unit (px/em/rem).
 */
Jymin.moveElement = function (element, left, top, width, height, unit) {
  unit = unit || Jymin.setUnit._unit || ''
}

/**
 * Get the width and height of the viewport as an array.
 *
 * @return {Array} [width, height]
 */
Jymin.getViewport = function () {
  function dim (key) {
    return Math.max(document.documentElement['client' + key], window['inner' + key] || 0)
  }
  return [dim('Width'), dim('Height')]
}
/**
 * If the argument is numeric, return a number, otherwise return zero.
 *
 * @param  {Object} number  An object to convert to a number, if necessary.
 * @return {number}         The number, or zero.
 */
Jymin.ensureNumber = function (number) {
  return isNaN(number *= 1) ? 0 : number
}

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 *
 * @param  {number} number  A number to pad.
 * @param  {number} length  A length to pad to.
 * @return {String}         The zero-padded number.
 */
Jymin.zeroFill = function (number, length) {
  number = '' + number
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0)
  return (new Array(length + 1)).join('0') + number
}
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
/**
 * Get the contents of a specified type of tag within a string of HTML.
 *
 * @param  {String}   html    [description]
 * @param  {String}   tagName [description]
 * @param  {Function} fn      [description]
 * @return {Array}            [description]
 */
Jymin.tagContents = function (html, tagName, fn) {
  var pattern = Jymin.tagPatterns[tagName]
  if (!pattern) {
    var flags = /^(html|head|title|body)$/.test(tagName) ? 'i' : 'gi'
    pattern = new RegExp('<' + tagName + '.*?>([\\s\\S]*?)<\\/' + tagName + '>', flags)
    Jymin.tagPatterns[tagName] = pattern
  }
  var contents = []
  html.replace(pattern, function (match, content) {
    contents.push(content)
    if (fn) {
      fn(content)
    }
  })
  return contents
}

Jymin.tagPatterns = {}
/**
 * Get the local storage object.
 *
 * @return {Object}  The local storage object.
 */
Jymin.getStorage = function () {
  return window.localStorage
}

/**
 * Fetch an item from local storage.
 *
 * @param  {String} key  A key to fetch an object by
 * @return {Any}         The object that was fetched and deserialized
 */
Jymin.fetch = function (key) {
  var storage = Jymin.getStorage()
  return storage ? Jymin.parse(storage.getItem(key)) : 0
}

/**
 * Store an item in local storage.
 *
 * @param  {String} key    A key to store and fetch an object by
 * @param  {Any}    value  A value to be stringified and stored
 */
Jymin.store = function (key, value) {
  var storage = Jymin.getStorage()
  if (storage) {
    storage.setItem(key, Jymin.stringify(value))
  }
}
/**
 * Ensure a value is a string.
 */
Jymin.ensureString = function (value) {
  return Jymin.isString(value) ? value : '' + value
}

/**
 * Return true if the string contains the given substring.
 */
Jymin.contains = function (string, substring) {
  return Jymin.ensureString(string).indexOf(substring) > -1
}

/**
 * Return true if the string starts with the given substring.
 */
Jymin.startsWith = function (string, substring) {
  return Jymin.ensureString(string).indexOf(substring) === 0; // jshint ignore:line
}

/**
 * Trim the whitespace from a string.
 */
Jymin.trim = function (string) {
  return Jymin.ensureString(string).replace(/^\s+|\s+$/g, '')
}

/**
 * Split a string by commas.
 */
Jymin.splitByCommas = function (string) {
  return Jymin.ensureString(string).split(',')
}

/**
 * Split a string by spaces.
 */
Jymin.splitBySpaces = function (string) {
  return Jymin.ensureString(string).split(' ')
}

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
Jymin.decorateString = function (string, replacements) {
  string = Jymin.ensureString(string)
  Jymin.each(replacements, function(replacement) {
    string = string.replace('*', replacement)
  })
  return string
}

/**
 * Perform a RegExp Jymin.match, and call a callback on the result
  */
Jymin.match = function (string, pattern, callback) {
  var result = string.match(pattern)
  if (result) {
    callback.apply(string, result)
  }
}

/**
 * Reduce a string to its alphabetic characters.
 */
Jymin.extractLetters = function (string) {
  return Jymin.ensureString(string).replace(/[^a-z]/ig, '')
}

/**
 * Reduce a string to its numeric characters.
 */
Jymin.extractNumbers = function (string) {
  return Jymin.ensureString(string).replace(/[^0-9]/g, '')
}

/**
 * Returns a lowercase string.
 */
Jymin.lower = function (object) {
  return Jymin.ensureString(object).toLowerCase()
}

/**
 * Returns an uppercase string.
 */
Jymin.upper = function (object) {
  return Jymin.ensureString(object).toUpperCase()
}

/**
 * Return an escaped value for URLs.
 */
Jymin.escape = function (value) {
  return '' + encodeURIComponent('' + value)
}

/**
 * Return an unescaped value from an escaped URL.
 */
Jymin.unescape = function (value) {
  return '' + decodeURIComponent('' + value)
}

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
Jymin.buildQueryString = function (object) {
  var queryParams = []
  Jymin.each(object, function (value, key) {
    queryParams.push(Jymin.escape(key) + '=' + Jymin.escape(value))
  })
  return queryParams.join('&')
}

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
Jymin.getBrowserVersionOrZero = function (browserName) {
  var match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent)
  return match ? +Jymin.match[1] : 0
}
/**
 * Set or reset a timeout or interval, and save it for possible cancellation.
 * The timer can either be added to the setTimer method itself, or it can
 * be added to an object provided (such as an HTMLElement).
 *
 * @param {Object|String} objectOrString  An object to bind a timer to, or a name to call it.
 * @param {Function}      fn              A function to run if the timer is reached.
 * @param {Integer}       delay           An optional delay in milliseconds.
 */
Jymin.setTimer = function (objectOrString, fn, delay, isInterval) {
  var useString = Jymin.isString(objectOrString)
  var object = useString ? Jymin.setTimer : objectOrString
  var key = useString ? objectOrString : '_timeout'
  clearTimeout(object[key])
  if (fn) {
    if (Jymin.isUndefined(delay)) {
      delay = 9
    }
    object[key] = (isInterval ? setInterval : setTimeout)(fn, delay)
  }
}

/**
 * Remove a timer from an element or from the Jymin.setTimer method.
 *
 * @param {Object|String} objectOrString  An object or a timer name.
 */
Jymin.clearTimer = function (objectOrString) {
  Jymin.setTimer(objectOrString)
}

/**
 * Throttle a function by preventing it from being called again soon.
 *
 * @param {Function}        fn            The function to throttle.
 * @param {Array|Arguments} args          Arguments to pass to the function.
 * @param {Number}          milliseconds  Number of milliseconds to throttle.
 */
Jymin.throttle = function (fn, args, milliseconds) {
  if (Jymin.isNumber(args)) {
    milliseconds = args
    args = []
  }
  milliseconds = milliseconds || 9
  var now = Jymin.getTime()
  var until = fn._throttleUntil || now
  if (until <= now) {
    fn.apply(fn, args)
  }
  fn._throttleUntil = now + milliseconds
}

Jymin.times = {}

Jymin.now = function () {
  var perf = window.performance
  return perf && perf.now ? perf.now() : Date.now()
}

Jymin.startTime = function (label) {
  Jymin.times[label] = Jymin.getTime()
}

Jymin.endTime = function (label) {
  Jymin.times[label] = Jymin.getTime() - Jymin.times[label]
}

Jymin.beamTimes = function (label) {
  var times = []
  Jymin.each(Jymin.times, function (value, key) {
    times.push(key + ' ' + value + 'ms')
  })
  Beams.log(times.join(', '))
}

Jymin.logTimes = function (label) {
  var times = []
  Jymin.each(Jymin.times, function (value, key) {
    times.push(key + ' ' + value + 'ms')
  })
  console.log(times.join(', '))
}
/**
 * Check whether a value is undefined.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is undefined.
 */
Jymin.isUndefined = function (value) {
  return typeof value === 'undefined'
}

/**
 * Check whether a value is a boolean.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a boolean.
 */
Jymin.isBoolean = function (value) {
  return typeof value === 'boolean'
}

/**
 * Check whether a value is a number.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a number.
 */
Jymin.isNumber = function (value) {
  return typeof value === 'number'
}

/**
 * Check whether a value is a string.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a string.
 */
Jymin.isString = function (value) {
  return typeof value === 'string'
}

/**
 * Check whether a value is a function.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a function.
 */
Jymin.isFunction = function (value) {
  return typeof value === 'function'
}

/**
 * Check whether a value is an object.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an object.
 */
Jymin.isObject = function (value) {
  return typeof value === 'object'
}

/**
 * Check whether a value is null.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is null.
 */
Jymin.isNull = function (value) {
  return value === null
}

/**
 * Check whether a value is an instance of a given type.
 *
 * @param  {Any}      value        A value to check.
 * @param  {Function} Constructor  A constructor for a type of object.
 * @return {boolean}               True if the value is an instance of a given type.
 */
Jymin.isInstance = function (value, Constructor) {
  return value instanceof Constructor
}

/**
 * Check whether a value is an array.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an array.
 */
Jymin.isArray = function (value) {
  return Jymin.isInstance(value, Array)
}

/**
 * Check whether a value is a date.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a date.
 */
Jymin.isDate = function (value) {
  return Jymin.isInstance(value, Date)
}

/**
 * Check whether a value is an error.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an error.
 */
Jymin.isError = function (value) {
  return Jymin.isInstance(value, Error)
}

/**
 * Check whether a value is a regular expression.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a regular expression.
 */
Jymin.isRegExp = function (value) {
  return Jymin.isInstance(value, RegExp)
}
/**
 * Get the current location host.
 */
Jymin.getHost = function () {
  return location.host
}

/**
 * Get the base of the current URL.
 */
Jymin.getBaseUrl = function () {
  return location.protocol + '//' + Jymin.getHost()
}

/**
 * Get the query parameters from a URL.
 */
Jymin.getQueryParams = function (url) {
  url = url || location.href
  var query = url.substr(url.indexOf('?') + 1).split('#')[0]
  var pairs = query.split('&')
  query = {}
  Jymin.each(pairs, function (pair) {
    var eqPos = pair.indexOf('=')
    var name = pair.substr(0, eqPos)
    var value = pair.substr(eqPos + 1)
    query[name] = value
  })
  return query
}

/**
 * Get the query parameters from the hash of a URL.
 */
Jymin.getHashParams = function (hash) {
  hash = (hash || location.hash).replace(/^#/, '')
  return hash ? Jymin.getQueryParams(hash) : {}
}
