function assert(value, desc) {
  var li = document.createElement("li");
  li.className = value ? "pass" : "fail";
  li.appendChild(document.createTextNode(desc));
  document.getElementById("results").appendChild(li);
  return !!value;
}

function testOutline(rootId, expected) {
  var root = document.getElementById(rootId),
      madeOutline = makeOutline(root),
      result = assert(_.isEqual(madeOutline, expected), '#' + rootId);

  root.nextSibling.textContent = JSON.stringify(madeOutline, null, 2);

  if(!result) {
    console.log(rootId + ' made', madeOutline, rootId + ' expected', expected);
    root.className = 'fail';
  }
  return result;
}
