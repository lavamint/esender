var ajax = function(method, path, data, callback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    r.setRequestHeader("Authorization", "Basic OTg2NDAyMzAtZjZhNC00MzczLWFiYmUtNGVmMjJkNDZkZTAyOjk0ZWU5YmZkLTlhOGQtNGU3Ni1hNDliLTEwZmNiNDBiYTU2Mw==");
    r.send(data)
}

var __main = function() {
    var url = 'https://bluemail.w3ibm.mybluemix.net/rest/v2/emails'
    var method = 'POST'
    var data = JSON.stringify({
        "contact": "sender@us.ibm.com",
        "recipients": [
            {
              "recipient": "chenxyfr@cn.ibm.com"
            }
        ],
        "subject": "Bluemix BlueMail Test Wed Sept 22 11:44:51 EDT 2015",
        "message": "Testing the email service. Defaults selected."
    });
    ajax(method, url, data, (r) => {
        console.log(r)
    })
}

//
