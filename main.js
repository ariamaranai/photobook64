chrome.bookmarks.getChildren("2", otherBookmarks => {
  let root = otherBookmarks.findLast(v => v.title == "photobook64");
  root && chrome.bookmarks.getChildren(root.id, nodes => {
    let i = 0;
    while (i < nodes.length) {
      let { url, title } = nodes[i];
      let img = new Image;
      img.src = url;
      document.body.appendChild(img).title = title;
      ++i;
    }
  });
});