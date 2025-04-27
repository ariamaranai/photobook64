chrome.action.onClicked.addListener(tab =>
  chrome.tabs.create({
    url: "photobook64.htm",
    index: tab.index + 1
  })
)
chrome.contextMenus.onClicked.addListener(info => (
  chrome.action.setPopup({ popup: "popup.htm" }),
  chrome.action.openPopup(() =>
    chrome.runtime.sendMessage(info.srcUrl)
  ),
  chrome.action.setPopup({ popup: "" })
));
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Bookmark image",
    contexts: ["image"]
  })
);