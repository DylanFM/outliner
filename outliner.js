// From spec:
//  The outline for a sectioning content element or a sectioning root element 
//  consists of a list of one or more potentially nested sections. A section 
//  is a container that corresponds to some nodes in the original DOM tree. 
//  Each section can have one heading associated with it, and can contain any 
//  number of further nested sections.
// Thoughts:
// - each section can have 1 heading associated with it

var headingContent = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP'],
  sectioningElements = ['SECTION', 'ARTICLE', 'NAV', 'ASIDE'];

// AKA is array
function isSection(i) {
  return {}.toString.call(i) == '[object Array]'; 
}

function isSectioningElement(el) {
  return sectioningElements.indexOf(el.tagName) > -1;
}

function isHeadingContentElement(el) {
  return headingContent.indexOf(el.tagName) > -1;
}

function topInHgroup(hgroup) {
  var top;
  // Find the highest heading element within and use its text
  try {
    headingContent.forEach(function(t) {
      var els = hgroup.getElementsByTagName(t);
      if(els.length) {
        top = els[0];
        // Escape from the loop - we've found our content
        throw BreakException; 
      }
    });
  } catch(e) {}
  return top;
}

function dataForHeadingContent(h) {
  return { tag: h.tagName, content: h.textContent};
}

function makeOutline(outlinee, root) {

  var section = [],
    el = outlinee.firstChild,
    outline, heading;

  // We're going to pass the very root of the outline through
  if(!root) {
    root = outlinee;
  }

  // Walk
  while(el) {

    // If it's a sectioning element, create a new level in the outline
    if(isSectioningElement(el)) {

      // Add a new outline for this sectioning element to the current outlinee's outline
      section.push(makeOutline(el, root));

    // If this element is heading content we want it
    } else if(isHeadingContentElement(el)) {

      // If we have an hgroup, find its top heading, otherwise just add the heading
      // Track it if we have a heading
      if ((heading = (el.tagName.length > 2) ? topInHgroup(el) : el)) {

        console.log(heading, dataForHeadingContent(heading));

        // We're tracking some more data so we can check rankings of heading content
        section.push(dataForHeadingContent(heading));

      }

    }

    // Move on to the next sibling
    el = el.nextSibling;
  }

  // If there isn't a title, give it one at the start
  if(outlinee !== root && section.every(isSection)) {

    section.unshift('Untitled ' + outlinee.tagName.toLowerCase());

  }

  // Return this outlinee's outline
  return section;
}
