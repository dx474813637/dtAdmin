let timeout = null

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return {Function} 返回一个防抖后的函数
 */
function debounce(func, wait = 500, immediate = false) {
    return function(...arg) {
        if (timeout !== null) clearTimeout(timeout)
        
        if (immediate) {
            const callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callNow && typeof func === 'function') {
                func(...arg)
            }
        } else {
            timeout = setTimeout(() => {
                if (typeof func === 'function') {
                    func(...arg)
                }
            }, wait)
        }
    }
}

export default debounce
