# Outliner
After reading about document outlines and spending a bit of time browsing http://140byt.es entries I thought I could try to write a document outliner in 140 bytes.
Well, I haven't done that yet, but I'd still like to. I spent a little bit of time doing some sketchy hacking http://jsfiddle.net/dylanfm/AbpXZ/ and then thought I'd move it to a Github repo and try to get it to follow the spec http://dev.w3.org/html5/spec/Overview.html#outlines - once that is done, I'll see if I can make it tiny.

So, for the time being this is rough and incomplete. Hopefully it'll become something worth a look soon. Maybe a bookmarklet can come out of it.

## Plans
1. Set up some tests - try to make them comprehensive and covering the document outline algorithm (I'll need to get the tests checked to make sure they're correct).
2. Focus on developing the outline generator bit, ignoring the existing code for displaying the generated outline.
3. Once that works correctly and the tests pass, try to get it _small_.
4. Investigate making a bookmarklet.

## Goals
* No CoffeeScript or external dependencies (I feel like I've ignored just plain ol' JS lately).
* Play with some ES5 things.
* Make something remotely useful.
* Make a bookmarklet (for the 1st time).