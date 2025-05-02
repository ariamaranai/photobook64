chrome.runtime.onMessage.addListener(srcUrl =>
  chrome.bookmarks.getChildren("2", async otherBookmarks => {
    t.placeholder = t.value = srcUrl;
    t.select();

    let rootId = (otherBookmarks.findLast(v => v.title == "photobook64") ||
      await chrome.bookmarks.create({
        title: "photobook64"
      })).id;
    let folderIds = [];
    let selectHTML = "";
    let latestUsedTime = 0;
    let latestUsedIndex = 0;
    let traverse = async (id, count) => {
      let nodes = await chrome.bookmarks.getChildren(id);
      let i = 0;
      while (i < nodes.length) {
        let node = nodes[i];
        if (node.url == null) {
          let { dateGroupModified, id, title } = node;
          selectHTML +=  "<option>" + " ".repeat(count) + "📂" + title;
          latestUsedTime < dateGroupModified && (
            latestUsedTime = dateGroupModified,
            latestUsedIndex = folderIds.push(id)
          );
          await traverse(id, count + 1);
        }
        ++i;
      }
    }
    await traverse(rootId, 0);
    folderIds.push(rootId);
    f.innerHTML = selectHTML + "<option>📁photobook64";
    f.children[latestUsedIndex].selected = 1;
    
    let reader = new FileReader;
    reader.readAsDataURL(await (await fetch(srcUrl)).blob());
    let dataUrl = (await new Promise(resolve => (reader.onload = resolve))).target.result;

    let parentId;
    let node;
    (onselect = () =>
      chrome.bookmarks.getChildren(parentId = folderIds[f.selectedIndex], nodes => {
        b.textContent = (node = nodes.find(v => v.url == dataUrl)) ? "Remove" : "Done",
        b.setAttribute("style", node ? "background:#923" : "")
      })
    )();
    b.onclick = () =>
      node
        ? chrome.bookmarks.remove({ id: node.id }, close)
        : chrome.bookmarks.create({
            parentId,
            title: t.value || srcUrl,
            url: dataUrl
          }, close);
  })
);