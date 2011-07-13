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
}
