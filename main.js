chrome.bookmarks.getChildren("2", otherBookmarks => {
  let root = otherBookmarks.findLast(v => v.title == "photobook64");
  if (root) {
    chrome.bookmarks.getChildren(root.id, nodes => {
      let i = 0;
      let { length } = nodes;
      let nodeIds = Array(length);
      while (i < length) {
        let node = nodes[i];
        let img = new Image;
        img.src = node.url;
        document.body.appendChild(img).title = node.title;
        nodeIds[i] = node.id;
        ++i;
      }
      chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
        let index = nodeIds.indexOf(id);
        if (index >= 0) {
          let img = document.images[index];
          img.src = changeInfo.url;
          img.title = changeInfo.title;
        }
      });
      chrome.bookmarks.onMoved.addListener(id => {
        let index = nodeIds.indexOf(id);
        index >= 0 &&
        document.images[index].remove(nodeIds.splice(index, 1));
      });
    });
  }
});