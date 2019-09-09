var insertName = function(name) {
    // 添加到 container 中
    var container = e('#id-nav')

    var t = `
        <a id="id-name">${name}</a>
        `
    container.insertAdjacentHTML('beforeend', t)
}

var insertImage = function(em) {
    // 添加到 container 中
    var container = e('#id-image')

    var t = `
        <img class="gua-avatar" src="https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/${em}">
        <span style="display: none" id="id-span-current-user" data-username="" data-email=""></span>
    `
    container.insertAdjacentHTML('beforeend', t)
}
var apiGetuser = (data, callback) => {
    var method = 'POST'
    var path = '/get/username'
    var data = {
        data
    }
    // 我们直接在 ajax 里面处理 data
    ajax(method, path, data, callback)
}
// 全局变量
var userId = ''
var userName = ''

var postname = function (userEmail) {
    var user = {
        email: userEmail
    }
    userId = userEmail
    apiGetuser(user, function(todo) {
        var d = JSON.parse(todo)
        insertName(d.name)
        userName = d.name
    })
}

$(document).ready(function(){
    const formValues = Swal.fire({
      title: 'User Log in',
      html:
        '<p></p><label>IBM w3id</label>'+
        '<input id="swal-input1" class="swal2-input" placeholder="Example:user@ibm.com">' +
        '<div>IBM w3id Password</div>'+
        '<input type="password" id="swal-input2" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
          var id = document.getElementById('swal-input1').value
          var password = document.getElementById('swal-input2').value
          var status = false
          if(id == ''||password =='') {
              log('x')
              Swal.showValidationMessage(
              `Request failed: Your w3id doesnot match password!`
              )
          }
          apiTodoComplete(id, password, function(todo) {
              // log('登陆成功', id, password, todo)
              if (todo == 'true') {
                  status = false
                  swal.close()
                  // swal.fire(success)
                  insertImage(id)
                  postname(id)
              } else {
                  status = true
                  Swal.showValidationMessage(
                 `Request failed: Your w3id doesnot match password!`
                 )
                }
            })
            return status
        }
    })
})
