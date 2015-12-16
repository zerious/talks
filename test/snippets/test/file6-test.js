var n = 6
var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
describe('File #' + n, function () {
  a.forEach(function (i) {
    var t = i * n * 10
    it('waits for ' + t + ' ms', function (done) {
      setTimeout(done, t)
    })
  })
})
