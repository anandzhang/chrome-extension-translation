const appendPopover = (x, y, result) => {
    const popover = document.createElement('div')
    popover.className = 'container-3d5d8f8a556f'
    popover.innerText = result
    popover.style.left = x + 'px'
    popover.style.top = y + 'px'
    document.body.appendChild(popover)
    document.addEventListener('mousedown', () => {
        document.body.removeChild(popover)
        document.getSelection().removeAllRanges()
    }, { once: true })
}

const requestTranslate = async text => {
    const formData = new FormData()
    formData.append('q', text)
    formData.append('from', 'en')
    formData.append('to', 'zh-CHS')
    try {
        const data = await fetch('https://aidemo.youdao.com/trans', {
            method: 'POST',
            body: formData,
            headers: {
                'User-Agent': navigator.userAgent
            }
        }).then(res => res.json())
        const { isWord, translation } = data
        if (isWord) {
            const { basic: { explains } } = data
            return explains.join('\n')
        }
        return translation
    } catch (err) {
        console.error(err)
    }
}

document.addEventListener('mouseup', async event => {
    const selectedText = document.getSelection().toString()
    if (selectedText) {
        const x = event.pageX
        const y = event.pageY
        const result = await requestTranslate(selectedText)
        if (result) appendPopover(x, y, result)
    }
})