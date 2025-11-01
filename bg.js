chrome.action.onClicked.addListener(tab =>
  tab.url != "chrome://newtab/"
    ? chrome.tabs.create({ url: "photobook64.htm", index: tab.index + 1 })
    : chrome.tabs.update({ url: "photobook64.htm" })
);
{
  let id;
  let title;
  chrome.runtime.onMessage.addListener(m =>
    id && chrome.bookmarks.update(id, {
      title: m + " | " + title
    })
  );
  chrome.contextMenus.onClicked.addListener(({ srcUrl }) => (
    chrome.action.setPopup({ popup: "popup.htm" }),
    chrome.action.openPopup(),
    chrome.action.setPopup({ popup: "" }),
    chrome.bookmarks.getChildren("2", async otherBookmarks => {
      let fr = new FileReader;
      fr.readAsDataURL(await (await fetch(srcUrl)).blob());
      let url = (await new Promise(resolve => fr.onload = resolve)).target.result;
      let parentId = (otherBookmarks.findLast(v => v.title == "photobook64") || await chrome.bookmarks.create({ title: "photobook64" })).id;
      let nodes = await chrome.bookmarks.getChildren(parentId);
      let i = 0;
      while (i < nodes.length) {
        let node = nodes[i];
        if (node.url == url) {
          chrome.bookmarks.remove(node.id);
          break;
        }
        ++i;
      }
      id = (await chrome.bookmarks.create({ parentId, title: title = srcUrl, url })).id
    })
  ));
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Bookmark image",
    contexts: ["image"],
    documentUrlPatterns: ["https://*/*", "http://*/*", "file://*"]
  })
);