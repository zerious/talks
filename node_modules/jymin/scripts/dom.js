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
  //+browser:old
  elements = []
  if (Jymin.contains(selector, ',')) {
    Jymin.each(selector, function (selector) {
      Jymin.all(parentElement, selector, function (element) {
        elements.push(element)
      })
    })
  } else if (Jymin.contains(selector, ' ')) {
    var pos = selector.indexOf(' ')
    var preSelector = selector.substr(0, pos)
    var postSelector = selector.substr(pos + 1)
    elements = []
    Jymin.all(parentElement, preSelector, function (element) {
      var children = Jymin.all(element, postSelector)
      Jymin.merge(elements, children)
    })
  } else if (selector[0] === '#') {
    var id = selector.substr(1)
    var child = Jymin.byId(parentElement.ownerDocument || document, id)
    if (child) {
      var parent = Jymin.parent(child)
      while (parent) {
        if (parent === parentElement) {
          elements = [child]
          break
        }
        parent = Jymin.parent(parent)
      }
    }
  } else {
    selector = selector.split('.')
    var tagName = selector[0]
    var className = selector[1]
    var tagElements = parentElement.getElementsByTagName(tagName)
    Jymin.each(tagElements, function (element) {
      if (!className || Jymin.hasClass(element, className)) {
        elements.push(element)
      }
    })
  }
  //-browser:old
  //+browser:ok
  elements = parentElement.querySelectorAll(selector)
  //-browser:ok
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
  //+browser:old
  element = Jymin.all(parentElement, selector)[0]
  //-browser:old
  //+browser:ok
  element = parentElement.querySelector(selector)
  //-browser:ok
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
