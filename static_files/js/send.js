var ajax = function(method, path, data, callback) {
    var r = new XMLHttpRequest()
    r.withCredentials = true
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

var apiPost = (data, callback) => {
    var url = 'https://bluemail.w3ibm.mybluemix.net/rest/v2/emails'
    data = JSON.stringify(data)
    ajax('POST', url, data, function(r) {
        var response = JSON.parse(r)
        callback(response)
    })
}

// var createEditor = () => {
//     var E = window.wangEditor
//     var editor = new E('#id-editor')
//     editor.create()
// }

var isSelectAll = () => {
    var recipients = []
	var checks = $(".check")
	for (i = 0; i < checks.length; i++){
		if (checks[i].checked){
            var email = checks[i].value
            log(email, 'ddd')
            // var recipient = {"recipient": `${email}`}
			recipients.push(email)
		}
	}
    // recipients = JSON.stringify(recipients)
    //
    // log(recipients, JSON.parse(recipients))
	return recipients
}

var filedata = null

$(document).ready(function(){
    $("#fileup").change(function(){
        var v = $(this).val();
        var reader = new FileReader();
        if (this.files[0] == undefined) {
            alert('未上传文件！');
            filedata = null
        } else {
            reader.readAsDataURL(this.files[0]);
            reader.onload = function(e){
                filedata = e.target.result
                log(e.target.result, '编码');

                $('#file_base64').val(e.target.result);
            };
        }
    });
});


var bindEventSend = () => {
    // 绑定 send 按钮的事件委托
    var sentButton = e('#id-button-send')
    sentButton.addEventListener('click', (event) => {
        // var self = event.target
        log('button click send')
        // 获取 input 的输入
        // var body = editor.txt.html()
        // console.log(body)
        // 获取 email
        var values = isSelectAll()
        log(values)
        for (var i = 0; i < values.length; i++) {
            value = values[i]
            if (filedata != null) {
                // 获取 attachments
                var fileup = e('#fileup')
                var filename = fileup.files[0].name

                var a = filedata.split("data:")[1]
                var b = a.split(";base64,")
                var content = b[0]
                var data = b[1]
                // log(filename, content, data)

                // 组装成对象
                var data = {
                    "contact": "chenxyfr@cn.ibm.com",
                    "recipients": [{"recipient": value}],
                    "subject": "Bluemix BlueMail Test Wed Sept 22 11:44:51 EDT 2015",
                    "message": "body",
                    "attachments": [
                        {
                            "attachment": {
                                "filename": filename,
                                "content_type": content,
                                "data": data
                            }
                        }
                    ]
                }
            } else {
                var data = {
                    "contact": "chenxyfr@cn.ibm.com",
                    "recipients": [{"recipient": value}],
                    "subject": "Bluemix BlueMail Test Wed Sept 22 11:44:51 EDT 2015",
                    "message": "body"
                }
            }
        // send
        apiPost(data, (r) => {
            log('发送成功', r)
            alert('发送成功')
        })
        }
    })
}

var __main = function() {
    // createEditor()
    bindEventSend()
}
__main()
