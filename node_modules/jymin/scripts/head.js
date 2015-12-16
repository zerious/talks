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
