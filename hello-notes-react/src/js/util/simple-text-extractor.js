// basic client-side clean
function childrenText(node) {
  if (!node) { return ""; }
  if (node.nodeName === "#text") {
    const val = node.textContent;
    if (val) {
      return " " + val;
    }
    return "";
  }
  const children = node.childNodes;
  if (children && children.length) {
    let combined = "";
    for (let index=0; index<children.length; index++) {
      combined += " " + childrenText(children[index]);
    }
    return combined;
  }
  return "";
}

module.exports = function(content) {
  const temp = document.createElement("div");
  const { body } = document;
  temp.setAttribute("style", "display: none;");
  body.append(temp);
  temp.innerHTML = content;
  const cleaned = childrenText(temp).trim();
  temp.remove();
  return cleaned;
}