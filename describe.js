// This is just used for displaying the outline. 
function describeOutline(outline) {
    var indentForDepth = function(depth) {
        var str = '';
        for(i=depth;i>0;i--) {
            str += '\t';
        }
        return str;
    },
    childrenAreStrings = function(ar, depth) {
        var depth = (depth && (depth + 1)) || 1;
        return ar.map(function(item) {
            if({}.toString.call(item)=='[object Array]') {
                return childrenAreStrings(item, depth).join('\n');
            } else {
                return indentForDepth(depth) + '- ' + String(item);
            }
        });
    };
    // Make sure all items in ar are strings
    return childrenAreStrings(outline).join('\n');    
}
