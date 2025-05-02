chrome.runtime.onMessage.addListener(m => {
  let input = document.body.lastChild;
  input.select(input.value = m);
  onkeyup = e => e.keyCode == 13 && close((e = input.value) != m && chrome.runtime.sendMessage(e))
});