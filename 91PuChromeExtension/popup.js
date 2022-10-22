

chrome.tabs.query({active:true ,currentWindow: true }).then(getSelectedTab);


function getSelectedTab(tabs) {
    var sendMessage = (messageObj) => {chrome.tabs.sendMessage(tabs[0].id,messageObj)};
    $("#run").click(function (e) {
        sendMessage({ action: 'run' });
    });
}



