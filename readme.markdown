Intro
=====

This is a javascript simulator of the DCPU-16 CPU as released by Notch in early April 2012. [The full spec can be found here.] (http://0x10c.com/doc/dcpu-16.txt)
I tried to fully test the CPU. You can find the tests in:  tests.html
The keyboard buffer spec is taken [from this example code released by Notch](http://pastebin.com/raw.php?i=aJSkRMyC)
The screen spec is taken [from this example released by Notch.](http://i.imgur.com/XIXc4.jpg)
Thanks to evilpie, the code from his [javascript disassembler] (https://gist.github.com/2300590") I use in some places. 
			
Known issues:
-------------
* JSR not implemented yet
* The online assemblers assemble this line "set a, 1" into 8401, that doesn't work right yet, instead use: 7c01 0001 

What is DCPU-16?
================
		
Recently Notch (of Minecraft fame) anounced his new game: [0x10c](http://0x10c.com/). It is a space game. In this game you control your ship via a computer. This computer is the dcpu-16 
and is fully programmable. Notch released the spec and a lot of tools have been released in the days after. This is one such a tool.
Primarly created for the fun 
		