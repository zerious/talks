var lighter = require('lighter')
var app = lighter({
  port: 9797,
  processCount: 1
})

app.chug.on('ready', function () {
  if (process.send) {
    process.send('online')
  }
})

require('./lib/decks')(app)
require('./lib/auth')(app)

require('events').EventEmitter.defaultMaxListeners = 1e3
