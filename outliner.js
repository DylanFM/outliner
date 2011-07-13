// See http://html5doctor.com/document-outlines/
// That article begins with info on HTML4 document outlines
// This doesn't do that yet, it just handles the HTML5 stuff beneath in the article
// I'm sure there are problems with handling that HTML5 stuff tho

var headingElements = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    sectioningElements = ['SECTION', 'ARTICLE', 'NAV', 'ASIDE'];

function makeOutline(root) {
    var ar = [],
        el = root.firstChild,
        nested, hg;
    while(el) {
        // If it's a sectioning element, create a new level in the outline
        if(sectioningElements.indexOf(el.tagName) > -1) {
            nested = makeOutline(el);
            if(nested.every(function(i){ return typeof i !== 'string'; })) {
                nested.unshift('Untitled ' + el.tagName.toLowerCase());
            }
            ar.push(nested);
        } else if(headingElements.indexOf(el.tagName) > -1) {
            ar.push(el.textContent);
        } else if(el.tagName === 'HGROUP') {
            hg = undefined;
            // Find the highest heading element within
            // Use its text, otherwhise it's untitled
            try {
                headingElements.forEach(function(t) {
                    els = el.getElementsByTagName(t);
                    if(els.length) {
                        hg = els[0].textContent;
                        throw BreakException;
                    }
                });
            } catch(e) {}
            if(!hg) {
                hg = 'Untitled hgroup';
            }
            ar.push(hg);
        }
        el = el.nextSibling;
    }
    return ar;
};

var outline = makeOutline(document.body);

// This is just used for displaying the outline. 
// Inspect the outline variable to see the generated array:
// console.log(outline);
    
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

(document.getElementsByTagName('pre')[0]).textContent = describeOutline(outline);
