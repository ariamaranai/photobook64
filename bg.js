chrome.action.onClicked.addListener(tab =>
  tab.url != "chrome://newtab/"
    ? chrome.tabs.create({ url: "photobook64.htm", index: tab.index + 1 })
    : chrome.tabs.update({ url: "photobook64.htm" })
);
{
  let id;
  chrome.runtime.onMessage.addListener(title => id && chrome.bookmarks.update(id, { title }));
  chrome.contextMenus.onClicked.addListener(({ srcUrl }) => (
    chrome.action.setPopup({ popup: "popup.htm" }),
    chrome.action.openPopup(() => chrome.runtime.sendMessage(srcUrl)),
    chrome.action.setPopup({ popup: "" }),
    chrome.bookmarks.getChildren("2", async otherBookmarks => {
      let reader = new FileReader;
      reader.readAsDataURL(await (await fetch(srcUrl)).blob());
      let url = (await new Promise(resolve => reader.onload = resolve)).target.result;
      let parentId = (otherBookmarks.findLast(v => v.title == "photobook64") || await chrome.bookmarks.create({ title: "photobook64" })).id;
      let nodes = await chrome.bookmarks.getChildren(parentId);
      let node = nodes.find(v => v.url == url);
      node && chrome.bookmarks.remove(node.id);
      id = (await chrome.bookmarks.create({ parentId, title: srcUrl, url })).id
    })
  ));
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Bookmark image",
    contexts: ["image"],
    documentUrlPatterns: ["https://*/*", "file://*"]
  })
);