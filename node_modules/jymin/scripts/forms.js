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
