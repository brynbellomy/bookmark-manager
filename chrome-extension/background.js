chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
        // new chrome.declarativeContent.PageStateMatcher({
        //   pageUrl: {hostEquals: 'developer.chrome.com'},
        // })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

});

/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        const {
            pageTitle,
            pageURL,
            faviconURL,
            screenshotDataURL,
        } = request.data

        fetch('http://localhost:9919/url', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.data),
        }).then(resp => {
            resp.json().then(resp => {
                if (resp.error) {
                    callback(resp.error.toString())
                } else {
                    callback(null)
                }
            })
        }).catch(err => {
            callback(err)
        })

        return true; // prevents the callback from being called too early on return
    }
});
