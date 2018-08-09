---
title: Switching between Mac and Linux keyboards
tags: [keybindings]
---

At my workplace I use a mac but at home I use Linux / Windows. It will be too inefficient to switch between two different sets of keybindings, so I decided to configure my mac such that it has Windows-like keybindings.
<!--more-->

First, I changed modifier keys on the Mac. The main difference is that Mac uses the `cmd` key while Linux / Windows uses the `ctrl` key.

<figure class="no-border">
  <img src="/img/mac-keybindings.png" title="Switching modifier keys on Mac" alt="Switching modifier keys on Mac">
  <figcaption>Switching modifier keys on Mac</figcaption>
</figure>

This gets back most of the familiar commands: `ctrl+c`, `ctrl+v`, etc. I didn't change the function of the original `cmd` key because I still needed my `alt tab` equivalent

Then I created a file at `~/Library/KeyBindings/DefaultKeyBinding.dict`. This is what is in my file (modified from [Ben Ogle's blog](http://benogle.com/2010/01/18/windowslinux-developers-remap-your-mac.html)):

```js
/* ~/Library/KeyBindings/DefaultKeyBinding.Dict
This file remaps the key bindings of a single user on Mac OS X 10.5 to more closely
match default behavior on Windows systems.  This particular mapping assumes
that you have also switched the Control and Command keys already.

This key mapping is more appropriate after switching Ctrl for Command in this menu:
Apple->System Preferences->Keyboard & Mouse->Keyboard->Modifier Keys...->
Change Control Key to Command
Change Command key to Control
This applies to OS X 10.5 and possibly other versions.

Here is a rough cheatsheet for syntax.
Key Modifiers
^ : Ctrl
$ : Shift
~ : Option (Alt)
@ : Command (Apple)
# : Numeric Keypad

Non-Printable Key Codes

Up Arrow:     \UF700        Backspace:    \U0008        F1:           \UF704
Down Arrow:   \UF701        Tab:          \U0009        F2:           \UF705
Left Arrow:   \UF702        Escape:       \U001B        F3:           \UF706
Right Arrow:  \UF703        Enter:        \U000A        ...
Insert:       \UF727        Page Up:      \UF72C
Delete:       \UF728        Page Down:    \UF72D
Home:         \UF729        Print Screen: \UF72E
End:          \UF72B        Scroll Lock:  \UF72F
Break:        \UF732        Pause:        \UF730
SysReq:       \UF731        Menu:         \UF735
Help:         \UF746

NOTE: typically the Windows 'Insert' key is mapped to what Macs call 'Help'.
Regular Mac keyboards don't even have the Insert key, but provide 'Fn' instead,
which is completely different.
*/

{
"\UF729"   = "moveToBeginningOfLine:";                       /* Home         */
"@\UF729"  = "moveToBeginningOfDocument:";                   /* Cmd  + Home  */
"$\UF729"  = "moveToBeginningOfLineAndModifySelection:";     /* Shift + Home */
"$@\UF729" = "moveToBeginningOfDocumentAndModifySelection:"; /* Shift + Cmd  + Home */
"\UF72B"   = "moveToEndOfLine:";                             /* End          */
"@\UF72B"  = "moveToEndOfDocument:";                         /* Cmd  + End   */
"$\UF72B"  = "moveToEndOfLineAndModifySelection:";           /* Shift + End  */
"$@\UF72B" = "moveToEndOfDocumentAndModifySelection:";       /* Shift + Cmd  + End */

"^\UF702"   = "moveToBeginningOfLine:";                       /* Home         */
"^\UF703"   = "moveToEndOfLine:";                             /* End          */
"$^\UF703"  = "moveToEndOfLineAndModifySelection:";           /* Shift + End  */
"$^\UF702"  = "moveToBeginningOfLineAndModifySelection:";     /* Shift + Home */

"\UF72C"   = "pageUp:";                                      /* PageUp       */
"\UF72D"   = "pageDown:";                                    /* PageDown     */
"@x"  = "cut:";                                         /* Shift + Del  */
"@v"  = "paste:";                                       /* Shift + Help */
"@c"  = "copy:";                                        /* Cmd  + Help (Ins) */
"@\UF702"  = "moveWordBackward:";                            /* Cmd  + LeftArrow */
"@\UF703"  = "moveWordForward:";                             /* Cmd  + RightArrow */
"$@\UF702" = "moveWordBackwardAndModifySelection:";   /* Shift + Cmd  + Leftarrow */
"$@\UF703" = "moveWordForwardAndModifySelection:";   /* Shift + Cmd  + Rightarrow */
"@\U007f" = ( deleteWordBackward:);
}
```

This only works if you have changed the modifier keys mapping. And voila, it sort of works now and other than some IDE shortcut keymap customisation it hasn't been much of a hassle switching between the two computers.
