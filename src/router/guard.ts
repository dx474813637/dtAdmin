import router from '@/router'
import {toRefs} from 'vue'
// 导入进度条
import { start, close } from "@/utils/nporgress";
import pinia from '@/stores/index';  
// import {userStore} from '@/stores/user'
import {useSettingsStore} from '@/stores/settings'
// import {useFinanceStore} from '@/stores/finance'
// import {cateStore} from '@/stores/cate'
// import { ElMessage, ElMessageBox  } from 'element-plus'
router.beforeEach(async (to, from, next) => {
    const useSettings = useSettingsStore(pinia)
    // const user = userStore(pinia)
    // const finance = useFinanceStore(pinia)
    // const cate = cateStore(pinia)
    // const {account_info} = toRefs(finance)
    // const {cpy_info, role, communityRole} = toRefs(user)
    // const { router_mode, menus } = toRefs(cate) 
    start()
    // console.log(to)
    if(to.name == 'reg' || to.name == 'login') { 
        next()
        return
    }
     // 检查是否需要登录
    if(to?.meta?.needLogin) {
        const userid = localStorage.getItem('userid')  
        if(!userid) {
            next({name: 'login'})
            return
        }
    }
    
    if(to?.meta?.title) {
        // document.title = to?.meta?.title
        useSettings.setTitle(to.meta.title)
    }  
    next()
})

router.afterEach(() => {
    close()
})

export default router