alert('tracking start1');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendUrl(tab.url);
});


var checkedUrl = null;
function sendUrl(uncheckedUrl) {
  var regex = /^http.*/;
  if(regex.exec(uncheckedUrl)) {
    checkedUrl = uncheckedUrl;

    // チャタリング防止のためのタイマー。
    chrome.alarms.create('onSetUrl', {when: Date.now() + 1000});
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if('onSetUrl' !== alarm.name) {
        return;
      }

      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if(checkedUrl && checkedUrl === tabs[0].url) {
          //xhr here
          var log = checkedUrl;
          checkedUrl = null;
          alert(log);
        }
      });
    });
  }
}
