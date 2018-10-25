include('keysyms.js');
include('keynames.js');

// This object keeps track of what keys have been pressed.
// Thus, it maps keys from [keysyms.js] to booleans
var pressed = {};

// here we define an array of rules.
// Each rule is an object with type:
// {
//  label?: string,
//  keys: number[],
//  action: number[] | (keys: number[]) => number[]
// }
var rules = [
  { label: "no capslock", keys: [KEY_CAPSLOCK], action: [] },
  { label: "no capslock and space", keys: [KEY_CAPSLOCK, KEY_SPACE], action: [] },

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
  { keys: [KEY_CAPSLOCK, KEY_E], action: [KEY_PAGEUP] },

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
  { keys: [KEY_CAPSLOCK, KEY_C], action: [KEY_BACKSPACE] },
  {
    label: "left enter",
    keys: [KEY_CAPSLOCK, KEY_TAB],
    action: [KEY_ENTER]
  },
  {
    label: "keypad_1",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_M],
    action: [KEY_1]
  },
  {
    label: "keypad_2",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_COMMA],
    action: [KEY_2]
  },
  {
    label: "keypad_3",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_DOT],
    action: [KEY_3]
  },
  {
    label: "keypad_4",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_J],
    action: [KEY_4]
  },
  {
    label: "keypad_5",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_K],
    action: [KEY_5]
  },
  {
    label: "keypad_6",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_L],
    action: [KEY_6]
  },
  {
    label: "keypad_7",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_U],
    action: [KEY_7]
  },
  {
    label: "keypad_8",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_I],
    action: [KEY_8]
  },
  {
    label: "keypad_9",
    keys: [KEY_CAPSLOCK, KEY_SPACE, KEY_O],
    action: [KEY_9]
  },
  {
    label: "left-hand left",
    keys: [KEY_CAPSLOCK, KEY_1],
    action: [KEY_LEFT]
  },
  {
    label: "left-hand down",
    keys: [KEY_CAPSLOCK, KEY_2],
    action: [KEY_DOWN]
  },
  {
    label: "left-hand up",
    keys: [KEY_CAPSLOCK, KEY_3],
    action: [KEY_UP]
  },
  {
    label: "left-hand right",
    keys: [KEY_CAPSLOCK, KEY_4],
    action: [KEY_RIGHT]
  },
  {
    label: "tilde",
    keys: [KEY_CAPSLOCK, KEY_N],
    action: [KEY_RIGHTALT, KEY_RIGHTBRACE, KEY_RIGHTBRACE]
  }

];

/* Helper function to emit a key */
function emitKey(code, value)
{
  emit(EV_KEY, code, value);
}

/* This is the entry point of event processing, this function will be called by the system for every key event.
 * IMPORTANT NOTE: this function must eventually emit some events back to the system otherwise your system
 * completely stops responding to keyboard!!!
 * Normally you want to emit almost all events with an exception of some keys you wish to process in a different way.
 */
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

function printPressed(pressed) {
  log("pressed")
  for (k in pressed) {
    if (pressed[k])
      log(k + ": " + pressed[k]);
  }
  log("")
}

/*
 * Process a key and thereby updating the [pressed] object
 */
function processKey(key) {
  if(key.value == 1)
  {
    pressed[key.code] = true;
  }
  else if(key.value == 0)
  {
    pressed[key.code] = false;
    emitKey(key.code, key.value);
    return;
  }
  printPressed(pressed);

  // find out if the current set of pressd keys match a rule
  var matched = findMatchingRules(pressed, key, rules);

  // if not, we simply re-emit it
  if(matched.length == 0)
  {
    emitKey(key.code, key.value);
    return;
  }

  // we cancel the key (not sure if necessary)
  key.cancel = true;

  // now to find out which of the matched rules to execute.
  // one option would be to execute all matching rules, but this is rarely
  // what we want.
  // instead, let's execute the matched rules with most required keys, i.e.
  // the most specific rule
  var match = matched[0];
  for(var i = 0; i < matched.length; i++)
  {
    var curMatch = matched[i];
    if (curMatch.label) {
    }
    if (match.keys.length < curMatch.keys.length) {
      match = curMatch;
    }
  }
  // let's get the keys to emit
  var keys = match.keys;
  var action = match.action;
  // the action can also be a function that maps keys to actions
  var keysToEmit = typeof action === "function" ? action(keys) : action;

  // there are some keys we consider modifiers and which are passed onto
  // the mapped action
  var modifiers = [];
  if (pressed[KEY_LEFTSHIFT]) {
    modifiers.push(KEY_LEFTSHIFT);
  }
  // finally, emit the sequence of keys that the rule maps to
  emitKeySequence(modifiers.concat(keysToEmit));
}

/*
 * returns a list of matched rules determined by the set of pressed keys
*/
function findMatchingRules(pressed, lastPressedKey, rules)
{
  var result = [];
  for(var i = 0; i < rules.length; i++)
  {
    rule = rules[i];

    var down = 0;
    var hasLastPressed = false;
    for(var j = 0; j < rule.keys.length; j++)
    {
      key = rule.keys[j];
      if (key == lastPressedKey.code)
        hasLastPressed = true;
      if(pressed[key] == undefined || pressed[key] == false)
        break;

      down++;

    }

    if(down == rule.keys.length && hasLastPressed)
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
