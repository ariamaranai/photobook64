chrome.bookmarks.getChildren("2", otherBookmarks => {
  let root = otherBookmarks.findLast(v => v.title == "photobook64");
  if (!root) return;
  chrome.bookmarks.getChildren(root.id, async treeNode => {
    let folders = treeNode.filter(v => "url" in v == 0);
    let d = document;
    let folderContainer = d.body.firstChild;
    let imageContainer = folderContainer.nextSibling;
    let i = 0;

    while (i < folders.length) {
      let folder = folders[i];
      folderContainer.appendChild(d.createElement("dt")).folderElement.textContent = "📁 " + folder.title;
      ++i;
    }
  });
})