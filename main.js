chrome.bookmarks.getChildren("2", async otherBookmarks => {
  let rootId = (otherBookmarks.findLast(v => v.title == "photobook64") || await chrome.bookmarks.create({ title: "photobook64" })).id;
  let nodes = await chrome.bookmarks.getChildren(rootId);
  let d = document;
  let i = 0;
  let nodeLen = nodes.length;
  let nodeIds = Array(nodeLen);
  while (i < nodeLen) {
    let node = nodes[i];
    let img = new Image;
    img.src = node.url;
    d.body.appendChild(img).title = node.title;
    nodeIds[i] = node.id;
    ++i;
  }
  d.onpaste = e => {
    let items = e.clipboardData.items;
    let filenames = [];
    let i = 0;
    let j = 0;
    while (i < items.length) {
      let item = items[i];
      if (item.type[0] == "i") {
        let file = item.getAsFile();
        let fr = new FileReader;
        fr.onload = async e => {
          let dataUrl = e.target.result;
          let { images } = d;
          let i = 0;
          while (
            i < images.length
              ? d.images[i].src != dataUrl
              : !nodeIds.push((await chrome.bookmarks.create({
                  parentId: rootId,
                  url: (d.body.appendChild(i = new Image).src = e.target.result),
                  title: i.title = filenames[j]
                })).id)
            ) ++i;
          ++j;
        }
        filenames[j] = file.name;
        fr.readAsDataURL(file);
        ++j;
      }
      ++i;
    }
    j = 0;
  }
  chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
    let index = nodeIds.indexOf(id);
    if (index >= 0) {
      let img = d.images[index];
      img.src = changeInfo.url;
      img.title = changeInfo.title;
    }
  });
  chrome.bookmarks.onMoved.addListener(id => {
    let index = nodeIds.indexOf(id);
    index >= 0 &&
    d.images[index].remove(nodeIds.splice(index, 1));
  });
});