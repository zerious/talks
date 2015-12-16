// Possible event.which values.
Jymin.LEFT_BUTTON = 1
Jymin.MIDDLE_BUTTON = 2
Jymin.RIGHT_BUTTON = 3

// Possible event.keyCode values.
Jymin.ENTER_KEY = 13
Jymin.SHIFT_KEY = 16
Jymin.CTRL_KEY = 17
Jymin.ALT_KEY = 18
Jymin.COMMAND_KEY = 19
Jymin.ESC_KEY = 27
Jymin.SPACE_KEY = 32
Jymin.LEFT_KEY = 37
Jymin.UP_KEY = 38
Jymin.RIGHT_KEY = 39
Jymin.DOWN_KEY = 40

Jymin.on('keydown,keyup', function (element, event, type) {
  Jymin.on[event.keyCode] = (type !== 'keyup')
})

Jymin.on('mousedown,mouseup', function (element, event, type) {
  Jymin.on[event.which] = (type !== 'mouseup')
})
