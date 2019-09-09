var ajax = function(method, path, data, responseCallback) {
    // 发送登录数据
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            responseCallback(r.response)
        }
    }
    data = JSON.stringify(data)
    // 发送请求
    r.send(data)
}

var apiSendemail = (data, callback) => {
    var method = 'POST'
    var path = '/send'
    var data = {
        data
    }
    // log(data)
    // 我们直接在 ajax 里面处理 data
    ajax(method, path, data, callback)
}

var isSelectAll = () => {
    var recipients = []
	var emails = $("#id-select-container").children()
	for (i = 0; i < emails.length; i++){
        var email = emails[i].id
        // var recipient = {"recipient": `${email}`}
    	recipients.push(email)
	}
	return recipients
}

var findBegins = (body) => {
    var begins = body['start']
    log(begins, 'start')
}


var getfilebody = (recipient, message, subject) => {
    var fileup = e('#fileup')
    var filename = fileup.files[0].name

    var a = filedata.split("data:")[1]
    var b = a.split(";base64,")
    var content = b[0]
    var dataA = b[1]
    var data = {
            contact: userId,
            recipients: [{
            recipient: recipient
            }],
            subject: subject,
            message: message,
            attachments: [{
                  "attachment": {
                      "filename": filename,
                      "content_type": content,
                      "data": dataA
                  }
              }]
          }

     return data
}

var getbody = (recipient, message, subject) => {
    var body = {
        contact: userId,
        recipients: [{
        recipient: recipient
        }],
        subject: subject,
        message: message
     }
     return body
}

var bindEventSend = () => {
    // 绑定 send 按钮的事件委托
    var sentButton = e('#id-send-container')
    sentButton.addEventListener('click', (event) => {
        // var self = event.target
        var recipients = isSelectAll()
        log(recipients)
        var all = 0
        var sups = es('.sup')
        for (var i = 0; i < sups.length; i++) {
            var sup = sups[i]
            sup.remove()
        }
      for (var i = 0; i < recipients.length; i++) {
          var recipient = recipients[i]
          var message = e(`#id-div-tag-content-${i+1}`)
          message = message.innerHTML
          var subjects = fileData[i]
          var subject = subjects['Subject']
          if (filedata != null) {
              var body = getfilebody(recipient, message, subject)
          } else {
              var body = getbody(recipient, message, subject)
          }

          Swal.fire({
            title: 'Waiting for sender.',
            html:
              'Sending......' ,
            timer: 10000,
            onBeforeOpen: () => {

              Swal.showLoading()

            },

          })

        apiSendemail(body, function(todo) {
            log('成功', todo)
            all += 1
            if (all == recipients.length) {
                Swal.fire({
                    title: 'All mail is sent.',
                    width: 600,
                    padding: '3em',
                    background: '#fff url(../images/trees.png)',
                  })
            }
        })

      }

    })
}


var bindEvents = () => {
    bindEventSend()
    // bindEventGetname()
}

var __main = () => {
    bindEvents()
}

__main()
