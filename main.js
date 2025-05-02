chrome.bookmarks.getChildren("2", otherBookmarks => {
  let rootId = otherBookmarks.findLast(v => v.title == "photobook64");
  if (!rootId) return;
  chrome.bookmarks.getChildren(rootId.id, nodes => {
    let i = 0;
    while (i < nodes.length) {
      let node = nodes[i];
      let { url } = node;
      if (url && url[0] == "d") {
        let img = new Image;
        img.src = url;
        document.body.appendChild(img);
      }
      ++i;
    }
  });
});