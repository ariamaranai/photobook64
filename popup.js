chrome.runtime.onMessage.addListener(srcUrl =>
  chrome.bookmarks.getChildren("2", async treeNode => {
    let rootId = (treeNode.findLast(v => v.title == "photobook64") || await chrome.bookmarks.create({ title: "photobook64" })).id;
    let folders = (await chrome.bookmarks.getChildren(rootId)).filter(v => "url" in v == 0);
    let ids = [];
    f.innerHTML =
      folders.length
        ? folders.reduce((a, v) => (ids.push(a.id), a + "<option>📁 " + v.title), "")
        : (chrome.bookmarks.create({ parentId: rootId, title: "images" }), "<option>📁 images");
    b.onclick = () =>
      fetch (srcUrl)
        .then(r => r.blob())
          .then(r => {
            let reader = new FileReader;
            reader.onload = e => chrome.bookmarks.create({
              parentId: ids[f.selectedIndex],
              title: t.value || srcUrl,
              url: e.target.result
            })
            reader.readAsDataURL(r);
          })
  })
);
