var log = console.log.bind(console)

var e = (selector) => document.querySelector(selector)

var es = (selector) => document.querySelectorAll(selector)

var templateChoice = function(choice) {
    var t = `
        <div class="chose-cell">
            <div class="div-choice">${choice}</div>
            <button class="button-chosed">select</button>
        </div>
    `
    return t
}

// 把所有 choice 插入到页面中
var insertChoices = function(choices) {
    // 添加到 container 中
    var apContainer = e('#id-appellation-container')
    for (var i = 0; i < choices.length; i++) {
        var choice = choices[i]
        var t = templateChoice(choice)
        apContainer.insertAdjacentHTML('beforeend', t)
    }
}

var appellations = [
    'Thank you for your kind letter.',
    'Sorry for delaying this letter so long.',
    'Your kind letter gives me much pleasure.'
]


var bindEventBegin = () => {
    // 绑定 send 按钮的事件委托
    var div = e('#id-div-container')
        div.addEventListener('click', (event) => {
            var self = event.target
            var id = self.id
            if (id == 'id-button-chosed') {
                self.addEventListener('click', (event) => {
                    var t = event.target
                    t.classList.toggle('submit')
                    var appel = e("#id-appellation-container")

                    if (appel.children.length != 0) {
                        while(appel.hasChildNodes()) {
                            appel.removeChild(appel.firstChild)
                        }
                    }
                    insertChoices(appellations)

                })
            }
        })
}

var __main = () => {
    bindEventBegin()

}

__main()
