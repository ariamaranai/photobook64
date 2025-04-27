chrome.runtime.onMessage.addListener(srcUrl =>
  chrome.bookmarks.getChildren("2", async otherBookmarks => {
    t.placeholder = t.value = srcUrl;
    t.select();

    let rootId = (otherBookmarks.findLast(v => v.title == "photobook64") ||
      await chrome.bookmarks.create({
        title: "photobook64"
      })).id;
    let folders = (await chrome.bookmarks.getChildren(rootId)).filter(v => "url" in v == 0);
    let ids = [];

    f.innerHTML =
      folders.length
        ? folders
          .sort((a, b) => (b.dataAdded < a.dataAdded || -1))
            .reduce((a, v) => (ids.push(v.id), a + "<option>📁 " + v.title), "")
        : (
            chrome.bookmarks.create({
              parentId: rootId,
              title: "images"
            }),
            "<option>📁 images"
          );
    
    let dataUrl =
      srcUrl[0] != "d"
        ? (await new Promise(resolve =>
            fetch (srcUrl)
              .then(r => r.blob())
                .then(r => {
                  let reader = new FileReader;
                  reader.onload = resolve;
                  reader.readAsDataURL(r);
                })
          )).target.result
        : srcUrl;

    let parentId = ids[f.selectedIndex];
    let oldItem;

    (onselect = () =>
      chrome.bookmarks.getChildren(parentId = ids[f.selectedIndex], treeNode => (
        b.textContent = (oldItem = treeNode.find(v => v.url == dataUrl)) ? "Remove" : "Done",
        b.setAttribute("style", oldItem  ? "background:#923" : "")
      ))
    )();

    b.onclick = () =>
      oldItem
        ? chrome.bookmarks.remove({ id: oldItem.id }, close)
        : chrome.bookmarks.create({
            parentId,
            title: t.value || srcUrl,
            url: dataUrl
          }, close);
  })
);
