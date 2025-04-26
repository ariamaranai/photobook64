chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Bookmark image",
    contexts: ["image"]
  })
);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.action.setPopup({ popup: "popup.htm" });
  chrome.action.openPopup(() =>
    chrome.runtime.sendMessage(info.srcUrl)
  );
  chrome.action.setPopup({ popup: "" });
});