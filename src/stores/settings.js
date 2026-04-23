// import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import {defineStore} from "pinia";
import router from "@/router/guard" 
// import { ElMessage, ElMessageBox  } from 'element-plus'
import {judgeBigScreen} from '@/utils'

// const { dynamicTitle } = defaultSettings
 
const storageSetting = JSON.parse(localStorage.getItem('storageSetting')) || ''
 
export const useSettingsStore = defineStore(
    'settings',
    {
        persist: true,
        state: () => ({
            loginToPage: null,
            title: '',
            isH5: judgeBigScreen(),
            webview: JSON.parse(localStorage.getItem('webview')),
            dynamicTitle: storageSetting.dynamicTitle === undefined ? import.meta.env.VITE_APP_TITLE : storageSetting.dynamicTitle
        }),
        actions: {
            // 设置网页标题
            setTitle(title) {
                this.title = title
                useDynamicTitle();
            },
            updateH5Size() {
                let res = judgeBigScreen()
                this.isH5 = res
            },
            goLogin() {
                router.push({ name: 'login' }) 
            },
            setPrevPage(route) { 
                console.log(route)
                if(route.name == 'login') return
                this.loginToPage = route 
            }, 
            loginSuccessRoute() { 
                if(this.loginToPage) {
                    router.push({ 
                        ...this.loginToPage
                    })  
                } else {
                    router.push({ 
                        name: 'user_index', 
                        params: {} 
                    }) 
                }
                this.loginToPage = null
                
            }, 
            copyEvent(data) {
                if(data.type == 'text') {
                    const clipboard = navigator.clipboard;
                    const text = data.content;
                    clipboard.writeText(text)
                    .then(() => { 
                        // ElMessage.success('信息已复制到剪贴板');
                    })
                    .catch((error) => {
                        // ElMessage.success('复制信息失败');
                        // console.error('复制信息失败:', error);
                    });
                }
            }
        }
    })
 
// export default useSettingsStore