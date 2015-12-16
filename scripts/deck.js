/* global Jymin Porta Beams */
// @use jymin/jymin.js
// @use beams/scripts/beams-jymin.js

var isFollowing = true
var handlers = Jymin.handlers.popstate = []
handlers.pop = Jymin.doNothing

var deckId = 'testing'
var userId = Jymin.getCookie('user')

var hash = window.location.href.split('#')[1]
Porta.state = {view: 'testing', slideIndex: hash || 0}

Jymin.on('ready', function () {
  Beams.on('chug:change', function (files) {
    window.location.reload()
  })
})

Jymin.on(document, 'keydown,left,right', function (element, event) {
  var key = event.keyCode
  var type = event.type
  if (key === 37 || type === 'left') {
    incrementSlide(-1, 1)
    isFollowing = 0
  } else if (key === 39 || type === 'right') {
    incrementSlide(1, 1)
    isFollowing = 0
  }
})

function incrementSlide (amount, userInitiated) {
  var slideCount = Jymin.all('slide').length
  var slideIndex = Porta.state.slideIndex || 0
  if (isNaN(amount)) {
    amount = 0
  }
  slideIndex = (slideIndex * 1 + amount + slideCount) % slideCount
  Porta.set('slideIndex', slideIndex)
  window.location.hash = slideIndex
  if (userInitiated) {
    isFollowing = false
    Beams.emit('move', {
      deck: deckId,
      user: userId,
      slide: slideIndex
    })
  }
}

Beams.on('move', function (data) {
  Porta.state.adminSlideIndex = data.slide
  var slideIndex = Porta.state.slideIndex || 0
  if ((data.deck === deckId) && (data.slide !== slideIndex) && isFollowing) {
    incrementSlide(data.slide - slideIndex, false)
  }
})

Beams.on('counts', function (data) {
  var votes = data.votes
  votes.TOTAL = 0
  votes.MAX = 0
  for (var key in votes) {
    if (key !== 'TOTAL' && key !== 'MAX') {
      votes.TOTAL += (votes[key] || 0)
      votes.MAX = Math.max(votes.MAX, votes[key])
    }
  }
  Porta.set('counts.' + data.poll, votes)
})

function resizeWindow () {
  var size = Math.min(window.innerHeight / 9, window.innerWidth / 16)
  document.body.style.fontSize = Math.round(size / 2) + 'px'
}

Jymin.on(window, 'resize,load', resizeWindow)
setTimeout(function () {
  incrementSlide(0)
  resizeWindow()
}, 1)

Jymin.on('label.radio,input.other', 'mouseup,keyup,change', function (element, event) {
  var input = element.tagName === 'LABEL' ? Jymin.one(element, 'input') : element
  if (input.checked) {
    Porta.set(input.name, input.value)
    Beams.emit('poll', {
      deck: deckId,
      user: userId,
      poll: input.name,
      value: input.value,
      other: Porta.state[input.name + 'Other']
    })
  }
})

Jymin.on('b.back', 'click', function () {
  incrementSlide(-1)
  isFollowing = false
})

Jymin.on('b.forward', 'click', function () {
  incrementSlide(1)
  isFollowing = false
})

Jymin.on('b.follow', 'click', function () {
  incrementSlide(Porta.state.adminSlideIndex - Porta.state.slideIndex)
  isFollowing = true
})
