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

function isSectioningElement(el) {
  return sectioningElements.indexOf(el.tagName) > -1;
}

function isDiv(el) {
  return el.tagName === 'DIV';
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

function makeOutline(outlinee, parent) {

  var section, current_outlinee, heading, outline, children;

  section = { 
    outlinee: outlinee, 
    outline: [] 
  };

  current_outlinee = outlinee.firstChild;

  // Walk
  while(current_outlinee) {

    // Make sure we're dealing with element nodes
    if (current_outlinee.nodeType === 1) {

      // If this element is heading content we want it
      if(isHeadingContentElement(current_outlinee)) {

        // If we have an hgroup, find its top heading, otherwise just add the heading
        if (!heading && (heading = current_outlinee.tagName.length > 2 ? topInHgroup(current_outlinee) : current_outlinee)) {

          // We're tracking some more data so we can check rankings of heading content
          heading = dataForHeadingContent(heading);

          // Make sure this heading has content
          if (heading.content.length) {
            section.outline.push(heading);
          }

        }

      } else if (isSectioningElement(current_outlinee) || isDiv(current_outlinee)) {

        // Make an outline for the element
        children = makeOutline(current_outlinee, section);

        if (children && children.length) {

          // If this is a div, it can still contain content
          if(isDiv(current_outlinee)) {
            
            // Don't add a new section, but append it to the current section
            section.outline = section.outline.concat(children);

          // If it's a sectioning element
          } else {

            // Create a section in the outline
            section.outline.push(children);

          }
        }
      }
    }

    // Move on to the next sibling
    current_outlinee = current_outlinee.nextSibling;

  }

  // Return this outlinee's outline, but convert it to a simple array
  outline = section.outline.map(function(i) {
    // We either want the outline or the content - arrays & strings
    if (!Array.isArray(i) && i.content) {
      return i.content;
    }
    return i;
  });

  // If we're not at the root and there are no headings
  if(parent && !isDiv(outlinee) && outline.every(Array.isArray)) {
    // Give it a generated heading
    outline.unshift('Untitled ' + outlinee.tagName.toLowerCase());
  }

  return outline;
}
