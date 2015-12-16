var decks = require('./decks')

module.exports = function (app) {
  app.use(function (request, response) {
    var userId = request.cookies.user
    var isAdmin = (request.cookies.pass === 'iamtheheadhoncho')
    if (!userId) {
      userId = Math.round(Math.random() * 1e20).toString(36)
      response.setHeader('set-cookie', 'user=' + userId)
    }
    if (isAdmin) {
      decks.users.get(userId).isAdmin = true
    }
    request.user = {
      id: userId,
      isAdmin: isAdmin
    }
    return true
  })
}
