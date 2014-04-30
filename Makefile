TARGET = bin/kbd-mangler
OBJECTS = main.o scripting.o

#CFLAGS = -I/usr/include/mozjs -DXP_UNIX
#CFLAGS = -I/usr/local/include
#LDFLAGS = -lmozjs185-1.0 -L/usr/lib -static -lpthread
#LDFLAGS = /usr/lib/libmozjs185-1.0.a -static -lmozjs185-1.0 -lpthread 
#LDFLAGS = -L/usr/local/lib -lmozjs185-1.0

#CFLAGS = -I/usr/include/xulrunner-1.9.1.8/unstable -DHP_UNIX
#LDFLAGS = -L/usr/lib/xulrunner-devel-1.9.1.8/sdk/lib -lmozjs

LDFLAGS = -L/opt/xulrunner-sdk/lib 
CFLAGS = -I/opt/xulrunner-sdk/include/js

all : $(TARGET)

$(TARGET) : $(OBJECTS)
	gcc $(LDFLAGS) -o $(TARGET) $(OBJECTS) -lmozjs

main.o : main.c
	gcc -c $(CFLAGS) main.c
scripting.o : scripting.c scripting.h
	gcc -c $(CFLAGS) scripting.c

clean :
	rm -rf $(OBJECTS) $(TARGET)

