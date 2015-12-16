/* global Jymin */
// @use beams/scripts/beams-jymin.js

var touchData
var swipeData

if (navigator.msPointerEnabled) {
  Jymin.ready(function () {
    var add = function (event, listener) {
      document.body.addEventListener(event, listener, false)
    }
    var trigger = function (event, type) {
      Jymin.emit({
        type: type,
        changedTouches: [{
          identifier: event.pointerId,
          target: event.target || event.currentTarget || document.body,
          pageX: event.pageX,
          pageY: event.pageY
        }]
      })
    }
    add('MSPointerDown', function (event) {
      trigger(event, 'touchstart')
    })
    add('MSPointerMove', function (event) {
      trigger(event, 'touchmove')
    })
    add('MSPointerUp', function (event) {
      trigger(event, 'touchend')
    })
  })
}

/**
 * Set up touch data and disable mouse events by removing their handlers.
 */
Jymin.on('touchstart', function (element, event, type) {
  if (!touchData) {
    touchData = {}
    var stopHanders = [function (element, event) {
      Jymin.stop(event)
    }]
    stopHanders.push = Jymin.no
    Jymin.each(Jymin.handlers, function (list, type) {
      if (/(mouse|click|contextmenu)/.test(type)) {
        Jymin.handlers[type] = stopHanders
      }
    })
  }

  // Iterate over new touches, ensuring that touch data exists.
  Jymin.each(event.changedTouches, function (touch) {
    var data = getTouchData(touch)

    // Set a timer for a "hold" event.
    Jymin.timer(data, function () {
      data = getTouchData(touch)
      if (data) {
        if (data._distance < 10) {
          triggerGesture(touch, 'hold')
        }
      }
    }, 400)
  })
})

Jymin.on('touchend', function (element, event, type) {
  var now = Jymin.getTime()
  Jymin.each(event.changedTouches, function (touch) {
    var data = getTouchData(touch)
    if (data) {
      Jymin.timer(data)
      var distance = data._distance
      var elapsed = now - data._start._t
      delete touchData[data._id]
      if (distance < 5 && elapsed < 2e3) {
        triggerGesture(touch, 'tap')
      }
    }
  })
  swipeData = 0
})

Jymin.on('touchmove', function (element, event, type) {
  Jymin.each(event.changedTouches, function (touch) {
    var data = getTouchData(touch)
    if (data) {
      var last = data._last
      var current = new TouchPoint(touch)
      var dX = current._x - last._x
      var dY = current._y - last._y
      var dT = current._t - last._t
      var d = Math.sqrt(dX * dX + dY * dY)
      var vX = dX / dT
      var vY = dY / dT
      var v = d / dT
      var r = Math.abs(vX / vY)
      if (v > 0.5 && !swipeData) {
        var direction
        if (r > 2) {
          direction = vX > 0 ? 'right' : 'left'
        }
        if (r < 0.5) {
          direction = vY > 0 ? 'down' : 'up'
        }
        if (direction) {
          swipeData = touch
          triggerGesture(touch, direction)
        }
      }
      data._last = current
      data._distance += d
      data._vX = data._vX ? (data._vX + vX) / 2 : vX
      data._vY = data._vY ? (data._vY + vY) / 2 : vY
    }
  })
})

function triggerGesture (touch, type) {
  touch.type = type
  setTimeout(function () {
    Jymin.emit(touch)
  }, 0)
}

function getTouchData (touch) {
  var id = '_' + touch.identifier
  var data = touchData[id]
  var point = new TouchPoint(touch)
  if (!data) {
    data = {
      _id: id,
      _start: point,
      _last: point,
      _distance: 0,
      target: touch.target
    }
    touchData[id] = data
  }
  return data
}

function TouchPoint (touch) {
  this._x = touch.pageX
  this._y = touch.pageY
  this._t = Jymin.getTime()
}
