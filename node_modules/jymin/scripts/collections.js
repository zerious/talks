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
