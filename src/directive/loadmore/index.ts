
import type { Directive, DirectiveBinding } from 'vue'
import { nextTick } from 'vue'
// 过滤前后空格的指令 v-trim
export default (app: any) => {
    app.directive('loadmore', {
        beforeMount(el: any, binding: DirectiveBinding) { 
            const selectDom = (document.querySelector(".more_select_dropdown") as any).querySelector(".el-select-dropdown .el-select-dropdown__wrap");
            function loadMores(this: any) {
                const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
                if (isBase) {
                    binding.value && binding.value()
                }
            }
            el.selectDomInfo = selectDom
            el.userLoadMore = loadMores
            nextTick(() => {
                selectDom?.addEventListener('scroll', loadMores)
            })
        },
        beforeUnmount(el: any) {
            if (el.userLoadMore) {
                el.selectDomInfo.removeEventListener('scroll', el.userLoadMore)
                delete el.selectDomInfo
                delete el.userLoadMore
            }
        } 
    })
}