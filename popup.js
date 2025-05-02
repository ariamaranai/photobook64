chrome.runtime.onMessage.addListener(m => (
  p.select(p.value = m),
  onkeyup = e => e.keyCode == 13 && close((e = p.value) != m && chrome.runtime.sendMessage(e))
));