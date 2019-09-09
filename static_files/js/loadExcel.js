var log = console.log.bind(console)

var e = (selector) => document.querySelector(selector)

var es = (selector) => document.querySelectorAll(selector)

var templateName = function(name) {
    var t = `
        <div>${name}</div>
        <p></p>
    `
    return t
}

var templateCheck = function(check, email, id) {
        var t = `
            <option class="audi" id="${email}" data-id="#id-li-tag-content-${id+1}">${check} (${email})</option>
        `
    return t
}

// 标签页（删了）
var templateContenttag = function(name, id) {
    var t = `
    <li class="tag" data-id="#id-li-tag-content-${id+1}">${name}</li>
    `
    return t
}

// 预览
var templateContent = function(person, id) {
    var recipientname = person['Recipient Name']
    var suppliername = person['Supplier Name']
    var supplieremail = person['Supplier Email']
    var greet = person['Greeting']
    var body1 = person['Body 1']
    var body2 = person['Body 2']
    var body3 = person['Body 3']
    var body4 = person['Body 4']
    var closure1 = person['Closure 1']
    var subject = person['Subject']

    var t = `
        <div class="tag-content" id="id-li-tag-content-${id+1}">
            <div id="id-div-tag-subject-${id+1}">
                <h3><span style="color: rgb(77, 128, 191);">Subject : <span class="class-body-1">${subject}<b class="class-body-all-1"></b></span></span></h3>
                <hr align="left" width="80%" color="rgb(77, 128, 191)" size="1" style="">
                <br>
            </div>
            <div id="id-div-tag-content-${id+1}">
                <p><span style="font-size: large;"><b>${greet} ${recipientname},</b></span><br>
                <br><br>
                <font size="3" class="class-body-2">${body1}<b class="class-body-all-2"></b></font>
                <br><br>
                <font size="3" class="class-body-3">${body2}
                <font style="text-shadow: 0 0 1px darkslateblue; color: darkblue;">${suppliername}</font>
                <font size="3">${body3}</font>
                <font style="text-shadow: 0 0 1px darkslateblue;color: darkblue;">${supplieremail}</font></font>
                <b class="class-body-all-3"></b>
                <br><br>
                <font size="3" class="class-body-4">${body4}<b class="class-body-all-4"></b></font>
                <br><br>
                <font size="3">${closure1}</font>
                <br><br><br>
                <font size="3">${userName}</font>
            </div>
        </div>

        `
    return t
}

var insertMark = function () {
    // var a =
    for (var i = 1; i < 8; i++) {
        var bodys = es(`.class-body-all-${i}`)
        if (i == 1) {
            var t = `
                <b class="sup">subject</b>
            `
        } else {
            var t = `
                <b class="sup">${i-1}</b>
            `
        }
        for (var j = 0; j < bodys.length; j++) {
            var body = bodys[j]
            body.insertAdjacentHTML('beforeend', t)
        }
    }
}

var insertContent = function(checks, persons) {
    // 添加到 container 中
    var tagContentList = e('.tag-content-list')

    var tagclist = $('.tag-content-list > *')
    if (tagclist.length != 0) {
        tagContentList.innerHTML = ''
    }
    for (var i = 0; i < checks - 1; i++) {
        var person = persons[i]
        var t = templateContent(person, i)
        tagContentList.insertAdjacentHTML('beforeend', t)
    }

    var tag = e(".tag-content")
    tag.classList.add('show')
    tagContentList.classList.add('yellow')
}

var insertContenttag = function(checks, persons) {
    // 添加到 container 中
    var tagList = e('.tag-list')
    var t = $('.tag-list > *')
    var num = t.length
    if (num != 0) {
        t.remove()
    }
    // for (var i = 0; i < checks - 1; i++) {
    //     var person = persons[i]
    //     var t = templateContenttag(person['Recipient Name'], i)
    //     tagList.insertAdjacentHTML('beforeend', t)
    //     var tag = e(".tag")
    //     tag.classList.add('active')
    // }
}

// 把所有 check 插入到页面中
var insertChecks = function(checks, persons) {
    // 添加到 container 中
    var todoContainer = e('#id-div-container')
    var classlist = $('.class-list > *')
    // if (classlist.length == 1) {
        var namelist = e('.class-namechose')
        var name = templateName('1.Please select the recipient to see the preview of the letter you will send.')
        namelist.innerHTML = name

        var fri = `
            <select id="id-select-container" class="list"></select>
        `
        // todoContainer.insertAdjacentHTML('beforeend', fri)
        todoContainer.innerHTML = fri
    // }

    var list = $('.list > *')
    if (list.length != 0) {
        for (var i = 0; i < list.length; i++) {
            var d = list[i]
            d.remove()
        }
    }
    for (var i = 0; i < checks - 1; i++) {
        var person = persons[i]
        if (person == undefined) {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'You submitted a malformed excel!',
            })
        }

        var selector = e("#id-select-container")

        var t = templateCheck(person['Recipient Name'], person['Recipient Email'], i)
        selector.insertAdjacentHTML('beforeend', t)
        selector.classList.add('list')
    }
}

// 把 button 插入到页面中
var insertButton = function() {
    // 添加到 container 中
    var container = e('#id-send-container')
    var classlist = $('.class-send > *')
    var t = `
        <button id="id-button-send" class="email-send">Send button</button>
    `
    if (classlist.length == 0) {
        container.insertAdjacentHTML('beforeend', t)
    }

    // insert Edit Button
    var edit = e('#id-edit-button')
    var editors = $('.class-edit-button > *')
    var tt = `
        <div>2.Click the button below to modify your email</div>
        <button id="id-button-edit">Edit button</button>
    `
    if (editors.length == 0) {
        edit.insertAdjacentHTML('beforeend', tt)
    }
}

var replaceEhtml = function(id, ehtml) {
    // 添加到 container 中
    var containers = es(`.class-body-${id + 1}`)
    var t = `
        <div class="inserted-body-${id+1}">
            ${ehtml}
        </div>
    `
    for (var i = 0; i < containers.length; i++) {
        var container = containers[i]
        // container.insertAdjacentHTML('beforeend', t)
        container.innerHTML = t
    }
}

var insertEhtml = function(id, ehtml) {
    var containers = es(`.class-body-${id + 1}`)
    var t = `
        <div class="inserted-body-${id+1}">
            ${ehtml}
        </div>
    `
    for (var i = 0; i < containers.length; i++) {
        var container = containers[i]
        container.insertAdjacentHTML('beforeend', t)
    }
}

var insertAttachment = function() {
    // 添加到 container 中
    var container = e('.attachment')
    var classlist = $('.attachment > *')

    var t = `
    <div>3.Upload Attachment Here(size limit: 20MB; Please compress all files into Winrar if more than one attachment)</div>
    <form οnsubmit="return false;">
        <a class="file">Upload your attachment
            <input type="hidden" name="file_base64" id="file_base64">
            <input type="file" id="fileup">
        </a>
    </form>
    `
    if (classlist.length == 0) {
        container.insertAdjacentHTML('beforeend', t)
    }
}

var insertChoseBody = function() {
    var container = e('.class-chose-body')
    var insertclass = e('.insert-button')
    var replaceclass = e('.replace-button')
    var deleteclass = e('.delete-button')
    var classlist = $('.class-chose-body > *')
    var t = `
        <div>Select which part you want to modify</div>
        <select id="id-selectbody-container">
            <option class="body-chose">subject</option>
            <option class="body-chose">body1</option>
            <option class="body-chose">body2</option>
            <option class="body-chose">body3</option>
        </select>
        `

    var tt = `
        <button id="id-insert-button">Insert</button>
        `
    var ttt = `
        <button id="id-replace-button">Replace</button>
        `
    var tttt = `
        <button id="id-delete-button">Delete</button>
        `
    if (classlist.length == 0) {
        container.insertAdjacentHTML('beforeend', t)
        insertclass.insertAdjacentHTML('beforeend', tt)
        replaceclass.insertAdjacentHTML('beforeend', ttt)
        deleteclass.insertAdjacentHTML('beforeend', tttt)
    }
}

var filedata = null

var beginExcel = () => {

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
                    // log(e.target.result, '编码');
                    Swal.fire({
                      type: 'success',
                      title: 'Upload success!',
                    })
                    $('#file_base64').val(e.target.result);
                };
            }
        });
    });
}
//
// $(".a-upload").on("change","input[type='file']",function(){
//     var filePath=$(this).val();
//     if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
//         $(".fileerrorTip").html("").hide();
//         var arr=filePath.split('\\');
//         var fileName=arr[arr.length-1];
//         $(".showFileName").html(fileName);
//     }else{
//         $(".showFileName").html("");
//         $(".fileerrorTip").html("您未上传文件，或者您上传文件类型有误！").show();
//         return false
//     }
// })


var fileData = ''

$('#excel-file').change(function(es) {
    var files = es.target.files;

    var fileReader = new FileReader();
    fileReader.onload = function(ev) {
        try {
            var data = ev.target.result,
                workbook = XLSX.read(data, {
                    type: 'binary'
                }), // 以二进制流方式读取得到整份excel表格对象
                persons = []; // 存储获取到的数据
        } catch (es) {
            alert('文件类型不正确');
            return;
        }

        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref'];
                // console.log(fromTo);
                persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                break; // 如果只取第一张表，就取消注释这行
            }
        }
        // 获得行数
        var rows = fromTo.slice(4)
        rows = Number(rows)
        var div = e("#id-div-container")

        if (div.children.length != 0) {
            while(div.hasChildNodes()) {
                div.removeChild(div.firstChild)
            }
        }

        fileData = persons
        insertChecks(rows, persons)
        insertContent(rows, persons)
        insertAttachment()
        insertButton()
        beginExcel()
    }

    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);

});


// insert editor
var createEditor = () => {
    var E = window.wangEditor
    var editor = new E('#id-editor')
    editor.create()
}

var bindAll = function(elements, eventName, callback) {
    for (var i = 0; i < elements.length; i++) {
        var tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

var bindEventCheckClick = function() {
    var num = 0
    var container = e('#id-div-container')
    container.addEventListener('click', (event) => {

        // 之前显示的内容先删除类 show，隐藏起来
        var old = e('.show')
        old.classList.remove('show')
        // 获取现在点击的菜单对应的内容 id

        var selectContainer = e('#id-select-container')
        var index = selectContainer.selectedIndex
        var cid = `#id-li-tag-content-${index + 1}`
        var current = e(cid)
        // 把现在点击的菜单对应的内容添加类 show，显示出来
        current.classList.add('show')

    })
}

var bindEventEditClick = function() {
    var num = 0
    var edit = e('#id-edit-button')
    edit.addEventListener('click', (event) => {
        num ++
        if (num == 1) {
            createEditor()
            insertChoseBody()
            insertMark()

            var news = es('.class-body-1')
            for (var i = 0; i < news.length; i++) {
                var n = news[i]
                n.classList.add('highlight')
            }
        }
    })
}

var bindEventEditHighlight = function() {
    var num = 0
    var choseBody = e('.class-chose-body')
    choseBody.addEventListener('click', (event) => {
        num++
        var olds = es('.highlight')
        for (var i = 0; i < olds.length; i++) {
            var old = olds[i]
            old.classList.remove('highlight')
        }
        // 获取现在点击的菜单对应的内容 id

        var selectbodyContainer = e('#id-selectbody-container')
        var index = selectbodyContainer.selectedIndex
        // log(index, num)
        var cid = `.class-body-${index + 1}`
        var currents = es(cid)
        // 把现在点击的菜单对应的内容添加类 show，显示出来
        for (var i = 0; i < currents.length; i++) {
            var current = currents[i]
            current.classList.add('highlight')

        }

    })
}

var bindEventInsertClick = function() {
    var insert = e('.insert-button')
    insert.addEventListener('click', (event) => {

        var selectContainer = e('#id-selectbody-container')
        var index = selectContainer.selectedIndex
        log(index)
        var etext = e(".w-e-text")
        var ehtml = etext.innerHTML
        if (index == 0) {
            for (var i = 0; i < fileData.length; i++) {
                var subjects = fileData[i]
                subjects['Subject'] += etext.innerText
            }
        }
        insertEhtml(index, ehtml)
    })
}

var bindEventReplaceClick = function() {
    var replace = e('.replace-button')
    replace.addEventListener('click', (event) => {

        var selectContainer = e('#id-selectbody-container')
        var index = selectContainer.selectedIndex
        log(index)
        var etext = e(".w-e-text")
        var ehtml = etext.innerHTML
        if (index == 0) {
            for (var i = 0; i < fileData.length; i++) {
                var subjects = fileData[i]
                subjects['Subject'] = etext.innerText
            }
        }
        replaceEhtml(index, ehtml)
    })
}

var bindEventDeleteClick = function() {
    var deleteButton = e('.delete-button')
    deleteButton.addEventListener('click', (event) => {
        var selectContainer = e('#id-selectbody-container')
        var index = selectContainer.selectedIndex
        var bodys = es(`.inserted-body-${index+1}`)
        for (var i = 0; i < bodys.length; i++) {
            var body = bodys[i]
            body.remove()
        }
    })
}

var bindEvents = function() {
    // bindEventTagClick()
    bindEventEditClick()
    bindEventEditHighlight()
    bindEventCheckClick()
    bindEventInsertClick()
    bindEventReplaceClick()
    bindEventDeleteClick()
}

var __main = function() {
    bindEvents()
}

__main()
