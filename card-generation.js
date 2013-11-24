/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+r),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+i), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+l)
 */

var log = '';

var type = 'H';

for (var i=1; i<=13; i++) {
    log += '.' + type + i + ' {\n';
    log += "\tbackground: url('../img/cards/" + type +  i + ".png');\n";
    log += '}\n\n';
}

console.log(log);