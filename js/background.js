chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendUrl(tab.url);
});

var checkedUrl = null;
function sendUrl(uncheckedUrl) {
  var regex = /^http.*/;
  if(regex.exec(uncheckedUrl)) {
    checkedUrl = uncheckedUrl;

    // チャタリング防止(通信回数を減らす)のためのタイマーコールバック。
    chrome.alarms.create('onSetUrl', {when: Date.now() + 1000});
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if('onSetUrl' !== alarm.name) {
        return;
      }

      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if(checkedUrl === tabs[0].url) {
          sendViaSocket(checkedUrl);
          checkedUrl = null;
        }
      });
    });
  }
}

var socket = null;
function sendViaSocket(url) {
  var roomName = 'myroom';
  var socketEndPoint = 'wss://firstsmart-nodejs.herokuapp.com/';
  if(!socket) {
    socket = io(socketEndPoint);
    socket.emit('joinRoom', roomName);
  }
  socket.emit('msg', url);
}
