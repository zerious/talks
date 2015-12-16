var fs = require('fs')
var Type = require('lighter-type')

var self = module.exports = function (app) {
  app.beams.on('poll', function (data) {
    var user = self.users.get(data.user)
    var deck = self.decks.get(data.deck)
    var value = data.value
    var other = data.other
    var key = data.deck + ',' + data.poll
    var poll = deck.polls.get(data.poll)
    var old = user.votes.get(key)
    if (old) {
      poll.votes.increment(old, -1)
    }
    poll.votes.increment(value, 1)
    if (other) {
      old = user.other.get(key)
      if (old) {
        poll.other.increment(old, -1)
      }
      console.log('Other: ' + other)
      poll.other.increment(value, 1)
    }
    user.votes.set(key, value)
    user.other.set(key, value)
    var counts = {
      deck: data.deck,
      poll: data.poll,
      votes: poll.votes.map,
      other: poll.other.map
    }
    app.beams.each(function (client) {
      client.emit('counts', counts)
    })
  })
  app.beams.on('move', function (data) {
    var user = self.users.get(data.user)
    user.slides.set(data.deck, data.slide)
    if (user.isAdmin) {
      app.beams.each(function (client) {
        client.emit('move', {
          deck: data.deck,
          slide: data.slide
        })
      })
    }
  })
}

var Set = Type.extend({
  init: function (DataType) {
    this.DataType = DataType
    this.map = {}
  },
  get: function (id) {
    return this.map[id] || (this.map[id] = new this.DataType())
  },
  set: function (id, value) {
    this.map[id] = value
  },
  increment: function (id, amount) {
    var value = this.get(id)
    value = Math.max(value + amount, 0)
    this.set(id, value)
  }
})

var Model = Type.extend({
  init: function (id) {
    this.id = id
    if (this.setup) {
      this.setup()
    }
  }
})

var User = Model.extend({
  setup: function setup (id) {
    this.isAdmin = false
    this.votes = new Set(String)
    this.other = new Set(String)
    this.slides = new Set(Number)
  }
})

var Deck = Model.extend({
  setup: function setup (id) {
    this.slides = new Set(Number)
    this.polls = new Set(Poll)
  }
})

var Poll = Model.extend({
  setup: function setup (id) {
    this.votes = new Set(Number)
    this.other = new Set(Number)
  }
})

self.decks = new Set(Deck)
self.users = new Set(User)
