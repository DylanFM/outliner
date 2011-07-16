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

function makeOutline(outlinee, parent) {

  var section, currentOutlinee, heading, children, sections, headingOutline, lastSection;

  section = { 
    outlinee: outlinee, 
    outline: [],
    heading: isHeadingContentElement(outlinee) ? outlinee : undefined // If we've passed a heading in we're going to set it automatically
  };

  // Usually we'll walk through children, but that's going to be different if we're making a HTML4-style outline for a heading
  currentOutlinee = isHeadingContentElement(outlinee) ? outlinee.nextSibling : outlinee.firstChild;

  // Walk
  while(currentOutlinee) {

    // Make sure we're dealing with element nodes
    if (currentOutlinee.nodeType === 1) {

      // If this element is heading content we want it
      if(isHeadingContentElement(currentOutlinee) && !currentOutlinee.OLtouched) {

        // SPEC: If the current section has no heading, let the element being entered be the heading for the current section.
        // If we have an hgroup, find its top heading, otherwise just add the heading
        if (!section.heading && (heading = currentOutlinee.tagName.length > 2 ? topInHgroup(currentOutlinee) : currentOutlinee)) {

          // Make sure this heading has content
          if (heading.textContent.length) {

            // Track its content
            section.outline.push(heading.textContent);

            // Track the heading for HTML4-style stuff
            section.heading = heading;
          }

        // SPEC: Otherwise, if the element being entered has a rank equal to or greater than the heading of the last section of the outline of the current outlinee, 
        //       then create a new section and append it to the outline of the current outlinee element, so that this new section is the new last section of that outline. 
        //       Let current section be that new section. Let the element being entered be the new heading for the current section.
        } else {

          // Make an outline for the heading
          headingOutline = makeOutline(currentOutlinee, section);
          headingOutline.unshift(currentOutlinee.textContent);

          // If it's a heading of higher or equal ranking
          if (currentOutlinee.tagName <= section.heading.tagName) {

            if (parent) {
              sections = parent.outline.filter(Array.isArray);
              lastSection = sections[sections.length-1];

              if (lastSection && lastSection.outline) {
                lastSection.outline.push(headingOutline);
              }

            } else {
              section.outline.push(headingOutline);
            }

          // SPEC: Otherwise, run these substeps:
          //       Let candidate section be current section.
          //       If the element being entered has a rank lower than the rank of the heading of the candidate section, then create a new section, and append it to candidate section.
          //       (This does not change which section is the last section in the outline.) Let current section be this new section. Let the element being entered be the new heading
          //       for the current section. Abort these substeps.
          //       Let new candidate section be the section that contains candidate section in the outline of current outlinee.
          //       Let candidate section be new candidate section.
          //       Return to step 2.
          //       Push the element being entered onto the stack. (This causes the algorithm to skip any descendants of the element.)
          } else {
            currentOutlinee.OLtouched = true;
            section.outline.push(headingOutline);
            // Doing this instead kinda makes the #test8 test look more correct to me
            // section.outline.push([currentOutlinee.textContent]);
          }
        }

      } else if (isSectioningElement(currentOutlinee) || isDiv(currentOutlinee)) {

        // Make an outline for the element
        children = makeOutline(currentOutlinee, section);

        if (children && children.length) {

          // If this is a div, it can still contain content
          if(isDiv(currentOutlinee)) {
            
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
    currentOutlinee = currentOutlinee.nextSibling;

  }

  // If we're not at the root and there are no headings
  if(parent && !isDiv(outlinee) && !section.heading) {
    // Give it a generated heading
    section.outline.unshift('Untitled ' + outlinee.tagName.toLowerCase());
  }

  return section.outline;
}
