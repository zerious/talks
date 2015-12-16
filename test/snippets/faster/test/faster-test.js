for (var d = 0; d < 25; d++) {
  describe('block' + d, function () {
    for (var i = 0; i < 100; i++) {
      it('sync' + i, function () {
        return 1
      })
      it('async' + i, function (done) {
        done()
      })
    }
  })
}
