/* global describe it */

var fs = require('fs')
var is = global.is || require('exam/lib/is')

var paths = ['test/snippet-test.js', 'package.json']
paths.forEach(function (path) {
  describe(path, function () {
    it('exists', function (done) {
      is(typeof fs.stat, 'function')
      fs.stat(path, function (error, stat) {
        is.falsy(error)
        is.object(stat)
        done()
      })
    })

    it('has content', function (done) {
      is(typeof fs.readFile, 'function')
      fs.readFile(path, function (error, content) {
        is.falsy(error)
        is.instanceOf(content, Buffer)
        done()
      })
    })
  })
})
