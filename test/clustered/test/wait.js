/* global describe it */

var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

module.exports = function wait (n) {
  describe('File #' + n, function () {
    a.forEach(function (i) {
      var t = i * n * 10
      it('waits for ' + t + ' ms', function (done) {
        setTimeout(done, t)
      })
    })
  })
}
