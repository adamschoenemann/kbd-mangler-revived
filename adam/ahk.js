include('keysyms.js');
include('keynames.js');

var pressed = {};

var rules = [
  { label: "no_capslock", keys: [KEY_CAPSLOCK], action: [] },
  // {
  // 	keys: [KEY_A, KEY_D],
  // 	action: [KEY_A, KEY_D, KEY_A, KEY_M, KEY_SPACE, KEY_E, KEY_R, KEY_SPACE, KEY_S, KEY_E, KEY_J]
  // },

  {
    label: "newline above",
    keys : [KEY_CAPSLOCK, KEY_LEFTALT, KEY_ENTER],
    action: [KEY_HOME, KEY_ENTER, KEY_UP]
  },

  {
    label: "newline below",
    keys : [KEY_CAPSLOCK, KEY_ENTER],
    action: [KEY_END, KEY_ENTER]
  },

  { keys: [KEY_CAPSLOCK, KEY_O], action: [KEY_ESC] },
  { keys: [KEY_CAPSLOCK, KEY_H], action: [KEY_LEFT] },
  { keys: [KEY_CAPSLOCK, KEY_J], action: [KEY_DOWN] },
  { keys: [KEY_CAPSLOCK, KEY_K], action: [KEY_UP] },
  { keys: [KEY_CAPSLOCK, KEY_L], action: [KEY_RIGHT] },
  { keys: [KEY_CAPSLOCK, KEY_W], action: [KEY_LEFTCTRL, KEY_RIGHT] },
  { keys: [KEY_CAPSLOCK, KEY_B], action: [KEY_LEFTCTRL, KEY_LEFT] },

  { keys: [KEY_CAPSLOCK, KEY_D], action: [KEY_PAGEDOWN] },
  { keys: [KEY_CAPSLOCK, KEY_U], action: [KEY_PAGEUP] },

  {
    label: "left brace",
    keys: [KEY_CAPSLOCK, KEY_P],
    action: [KEY_RIGHTALT, KEY_7]
  },
  {
    label: "right brace",
    keys: [KEY_CAPSLOCK, KEY_LEFTBRACE],
    action: [KEY_RIGHTALT, KEY_0]
  },

  {
    label: "left bracket",
    keys: [KEY_CAPSLOCK, KEY_LEFTALT, KEY_P],
    action: [KEY_RIGHTALT, KEY_8]
  },

  {
    label: "right bracket",
    keys: [KEY_CAPSLOCK, KEY_LEFTALT, KEY_LEFTBRACE],
    action: [KEY_RIGHTALT, KEY_9]
  },

  {
    label: "forward slash",
    keys: [KEY_CAPSLOCK, KEY_M],
    action: [KEY_LEFTSHIFT, KEY_7]
  },

  {
    label: "select line",
    keys: [KEY_CAPSLOCK, KEY_S],
    action: [KEY_END, KEY_LEFTSHIFT, KEY_HOME]
  },

  {
    label: "end",
    keys: [KEY_CAPSLOCK, KEY_A],
    action: [KEY_END]
  },

  {
    label: "home",
    keys: [KEY_CAPSLOCK, KEY_I],
    action: [KEY_HOME]
  },

  { keys: [KEY_CAPSLOCK, KEY_X], action: [KEY_DELETE] },
  { keys: [KEY_CAPSLOCK, KEY_C], action: [KEY_BACKSPACE] }

];

function emitKey(code, value)
{
  emit(EV_KEY, code, value);
}

function process(ev)
{
  if(ev.type == EV_KEY)
  {
    processKey(ev);
  }
  else
  {
    emit(ev.type, ev.code, ev.value);
  }
}

function processKey(key)
{
  if(key.value == 1)
  {
    pressed[key.code] = true;
  }
  else if(key.value == 0)
  {
    pressed[key.code] = false;
  }

  var matched = findMatchingRules(pressed, rules);
  if(matched.length == 0)
  {
    emitKey(key.code, key.value);
    return;
  }

  key.cancel = true;
  var match = matched[0];
  for(var i = 0; i < matched.length; i++)
  {
    var curMatch = matched[i];
    if (curMatch.label) {
      // log("potential rule: " + curMatch.label);
    }
    if (match.keys.length < curMatch.keys.length) {
      match = curMatch;
    }
  }
  // log("rule selected: " + (match.label || "<unlabeled>"))
  var keys = match.keys;
  var action = match.action;
  var keysToEmit = typeof action === "function" ? action(keys) : action;
  emitKeySequence(keysToEmit);

}

function findMatchingRules(pressed, rules)
{
  var result = [];
  for(var i = 0; i < rules.length; i++)
  {
    rule = rules[i];

    var down = 0;
    for(var j = 0; j < rule.keys.length; j++)
    {
      key = rule.keys[j];
      if(pressed[key] == undefined || pressed[key] == false)
        break;

      down++;

    }

    if(down == rule.keys.length)
    {
      result.push(rule);
    }
  }
  return result;
}

// a handy function to emit a sequence of keypresses/releases
function emitKeySequence(keys) {
  var i;
  for (i = 0; i < keys.length; i++)
    emitKey(keys[i], 1);
  for (i = keys.length - 1; i >= 0; i--)
    emitKey(keys[i], 0);
}
