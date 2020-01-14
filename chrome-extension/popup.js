let btnSubmit = document.getElementById('btn-submit')
let progressSpinner = document.querySelector('#activity-indicator .lds-ring')
let successIndicator = document.querySelector('#activity-indicator .success')
let failureIndicator = document.querySelector('#activity-indicator .failure')

btnSubmit.onclick = function(element) {


    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const pageTitle = tabs[0].title
        const pageURL = tabs[0].url
        const faviconURL = tabs[0].favIconUrl
        const data = { pageTitle, pageURL, faviconURL }

        progressSpinner.classList.remove('hidden')

        chrome.tabs.executeScript(tabs[0].id, {
            code: `
                ${window.libraryCode}

                html2canvas(document.body)
                    .catch(err => {
                        console.error('Error writing screenshot:', err)
                    })
                    .then(function(canvas) {
                        let dataURL
                        if (canvas) {
                            try {
                                dataURL = canvas.toDataURL("image/png")
                            } catch (err) {
                                console.error('Error writing screenshot:', err)
                            }
                        }
                        const data = {
                            ...${JSON.stringify(data)},
                            screenshotDataURL: dataURL,
                        }

                        chrome.runtime.sendMessage({
                            action: 'xhttp',
                            data: data,
                        }, function(err) {
                            if (err) {
                                chrome.runtime.sendMessage({ action: 'failure', error: err.toString() });
                            } else {
                                chrome.runtime.sendMessage({ action: 'success', data: data });
                            }
                        });
                    });

        `})
    })
}


chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == 'success') {
        progressSpinner.classList.add('hidden')
        successIndicator.classList.remove('hidden')
        setTimeout(() => successIndicator.classList.add('hidden'), 5000)

    } else if (request.action == 'failure') {
        progressSpinner.classList.add('hidden')
        failureIndicator.classList.remove('hidden')
        document.querySelector('.error-message').innerHTML = request.error.toString()
        // setTimeout(() => failureIndicator.classList.add('hidden'), 5000)
    }
})
