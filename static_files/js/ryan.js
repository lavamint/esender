var log = console.log.bind(console)

var e = selector => document.querySelector(selector)

var es = (selector) => {
    var elements = document.querySelectorAll(selector)
    return elements
}

var appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)
