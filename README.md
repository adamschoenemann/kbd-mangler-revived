# kbd-mangler revived

I'm trying to migrate to linux, but I miss AutoHotkey oh so dearly.
I found [kbd-mangler][1], which gives low-level access to keyboard and mouse events, so I am trying to use this to create an AHK-like experience, or at least recover my keybindings.
The problem with kbd-mangler is that it is from 2010 and thus quite old. It depends on mozillas's js library `libmozjs` which has been deprecated long ago.
However, one can get the required c library from older releases `xul-runner`.
In 2010, they didn't build `xul-runner` for x64 when doing stable releases, but they did on nightlies!
So here is a guide on how to build `kbd-mangler` and get going with writing your own system-wide hotkeys!

NOTE: I did not write most of this code myself; this is just a small repackaging and updated guide to use the software written by Gena Batyan to whom all credit is due!

# Installation
- `git clone` this repository down.
- download the appropriate version of xulrunner [from here][2]
- extract the zip archive you just downloaded to wherever you'd like: I've used `opt/xulrunner-sdk-1.9.2.1pre`
- modify the `Makefile` to make `LDFLAGS` and `CFLAGS` point to the location of the xulrunner sdk.
- run `make` in the repo directory
- `kbd-mangler` should be built successfully!
- inspect `run.sh` and follow the instructions in there to find your keyboard device file
- use `sudo ./run.sh [YOUR_SCRIPT_FILE]` to make the magic appear!
- in `adam/` there are some inspirational scripts -- specifically the `ahk.js` file is what I personally use.

# Run on login
Since `run.sh` will need to be run with `sudo`, you need to allow your user to run it as root with no password.
On Ubuntu/Debian you can do this by appending the following line to `visudo` or a file in `/etc/sudoers.d`:

```
[your_user] ALL = (root) NOPASSWD: [path_to_run_sh]
```

Where `[your_user]` and `[path_to_run_sh]` should be substituted with your username and the path to `run.sh` respectively.

Now you can add a line to `.xprofile` or something similar to start `run.sh` on login

```
sudo [path_to_run_sh] [path_to_your_js_script]
```

See the documentation for [kbd-mangler][1] for more information (can also be found in the `docs` folder).

# FAQ
- *Why this compared to e.g. autokey?* Many other solutions may not require `sudo` privileges, but capture key input on a higher level using e.g. X. This is a problem for applications that do not use this framework. For example, the `kitty` terminal does not respect autokey's configuration. Using kbd-mangler, we don't have this problem. On the other hand, it must be run as root.
- *Why javascript?* kbd-mangler uses javascript and I've not had time to port it to something else.
- *Why such an old version of js?* See answer above :). Pull requests are welcome!


[1]: http://kbd-mangler.sourceforge.net/
[2]: https://ftp.mozilla.org/pub/xulrunner/nightly/2010/12/2010-12-31-03-mozilla-1.9.2/
