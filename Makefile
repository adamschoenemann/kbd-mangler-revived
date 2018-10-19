TARGET = bin/kbd-mangler
OBJECTS = main.o scripting.o

#CFLAGS = -I/usr/include/mozjs -DXP_UNIX
#CFLAGS = -I/usr/local/include
#LDFLAGS = -lmozjs185-1.0 -L/usr/lib -static -lpthread
#LDFLAGS = /usr/lib/libmozjs185-1.0.a -static -lmozjs185-1.0 -lpthread
#LDFLAGS = -L/usr/local/lib -lmozjs185-1.0

#CFLAGS = -I/usr/include/xulrunner-1.9.1.8/unstable -DHP_UNIX
#LDFLAGS = -L/usr/lib/xulrunner-devel-1.9.1.8/sdk/lib -lmozjs

# ubuntu 18 x64
# download xulrunner from https://ftp.mozilla.org/pub/xulrunner/nightly/2010/12/2010-12-31-03-mozilla-1.9.2/xulrunner-1.9.2.14pre.en-US.linux-x86_64.sdk.tar.bz2
# and extract and copy to /opt/xulrunner-sdk-1.9.2.14pre
LDFLAGS = -L/opt/xulrunner-sdk-1.9.2.14pre/sdk/lib -lm -lmozjs
CFLAGS = -I/opt/xulrunner-sdk-1.9.2.14pre/include -DXP_UNIX

all : $(TARGET)

$(TARGET) : $(OBJECTS)
	gcc $(OBJECTS) $(LDFLAGS) -o $(TARGET)

main.o : main.c
	gcc -c $(CFLAGS) main.c
scripting.o : scripting.c scripting.h
	gcc -c $(CFLAGS) scripting.c

clean :
	rm -rf $(OBJECTS) $(TARGET)

