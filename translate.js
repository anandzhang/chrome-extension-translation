const selection = document.getSelection()
document.addEventListener('mouseup', async () => {
    const selectedText = selection.toString().trim()
    if (selectedText) {
        const rangeRect = selection.getRangeAt(0).getBoundingClientRect()
        const x = rangeRect.left
        const y = rangeRect.bottom + document.scrollingElement.scrollTop
        const result = await requestTranslate(selectedText)
        if (result) appendBubble(x, y, result)
    }
})

const appendBubble = (x, y, result) => {
    const bubble = document.createElement('div')
    bubble.className = 'container-3d5d8f8a556f'
    bubble.style.left = x + 'px'
    bubble.style.top = y + 'px'
    bubble.innerText = result
    document.body.appendChild(bubble)
    document.addEventListener('mousedown', () => {
        document.body.removeChild(bubble)
        selection.removeAllRanges()
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
