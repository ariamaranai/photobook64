chrome.bookmarks.getChildren("2", otherBookmarks => {
  let root = otherBookmarks.findLast(v => v.title == "photobook64");
  root && chrome.bookmarks.getChildren(root.id, nodes => {
    let i = 0;
    while (i < nodes.length) {
      let { url, title } = nodes[i];
      if (url && url[0] == "d") {
        let img = new Image;
        img.src = url;
        if (URL.canParse(title))
          document.body.append(img, title)
        else {
          let p = document.createElement("p");
          let index = title.lastIndexOf(" | ");
          p.textContent =  title.slice(0, index);
          document.body.append(p, img, title.slice(index + 3));
        }
      }
      ++i;
    }
  });
});