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
    // 处理 data
    data = JSON.stringify(data)
    // 发送请求
    r.send(data)
}

var apiTodoComplete = (id, password, callback) => {
    var method = 'POST'
    var path = '/todo/complete/'
    var data = {
        id: id,
        password: password
    }
    // 我们直接在 ajax 里面处理 data
    ajax(method, path, data, callback)
}

var bindEventComplete = () => {
    // 绑定 complete 按钮的事件委托
    var container = e('#id-div-name-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('class-completed')) {
            // 用 ajax 发送给服务器
            var idCell = e('.class-id')
            var passwordCell = e('.class-password')
            var id = idCell.value
            var password = passwordCell.value
            apiTodoComplete(id, password, function(todo) {
                // log('登陆成功', id, password, todo)
                if (todo == 'true') {
                    log('success')

                } else {
                    alert('error')
                }
                // 标记成功后, 在页面元素 cell 上面添加 class
                // todoCell.classList.add('completed')
            })
        }
    })
}

var success = {
    type: 'success',
    title: 'Hello!',
    text: 'You success login!',
}

var guasync = function(asyncall) {
    setTimeout(function() {
        asyncall()
    }, 0)
}


var bindEvents = () => {
    // bindEventComplete()
}

var __main = () => {
    bindEvents()
}

__main()
