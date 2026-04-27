// import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import {defineStore} from "pinia";
import router from "@/router/guard" 
// import { ElMessage, ElMessageBox  } from 'element-plus'
import {judgeBigScreen} from '@/utils'
import apis from '@/apis/index'

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
            },
            // 上传图片到upimg接口
            async uploadImage(file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await apis.upimg(formData);
                    if (res.code === 1) {
                        return res.list;
                    } else {
                        throw new Error('图片上传失败');
                    }
                } catch (error) {
                    console.error('上传失败', error);
                    throw error;
                }
            },
            // 批量上传图片
            async uploadImages(files) {
                try {
                    // 使用Promise.all并行上传多张图片
                    const uploadPromises = files.map(file => this.uploadImage(file));
                    const results = await Promise.all(uploadPromises);
                    return results;
                } catch (error) {
                    console.error('批量上传失败', error);
                    throw error;
                }
            }
        }
    })
 
// export default useSettingsStore