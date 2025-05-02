chrome.runtime.onMessage.addListener(srcUrl =>
  chrome.bookmarks.getChildren("2", async otherBookmarks => {
    let reader = new FileReader;
    reader.readAsDataURL(await (await fetch(srcUrl)).blob());
    let url = (await new Promise(resolve => reader.onload = resolve)).target.result;

    let parentId = (otherBookmarks.findLast(v => v.title == "photobook64") || await chrome.bookmarks.create({ title: "photobook64" })).id;
    chrome.bookmarks.getChildren(parentId, nodes => {
      let node = nodes.find(v => v.url == url);
      node && chrome.bookmarks.remove(node.id);

      let input = document.body.lastChild;
      input.value = srcUrl;
      input.select();

      chrome.bookmarks.create({
        parentId,
        title: input.value || srcUrl,
        url
      }, node =>
        onkeyup = e => e.keyCode == 13 && close(chrome.bookmarks.update(node.id, {
          title: input.value || srcUrl
        }))
      );
    });
  })
);