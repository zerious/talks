module.exports = {
  index: function GET (request, response) {
    response.view('testing', {user: request.user})
  }
}
