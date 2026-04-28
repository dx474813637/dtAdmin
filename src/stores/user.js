import {
	defineStore
} from 'pinia';
import apis from '@/apis/index'
import router from "@/router/guard"  
// console.log(router.getRoutes())
// import { useStoreB } from '@/store/modules/page_b';
// const storeB = useStoreB();
// let { pniaBcuntData } = storeToRefs(storeB); 
export const userStore = defineStore('user', {
	persist: {
		enabled: true, // true 表示开启持久化保存 默认保存到sessionStorage 
		// strategies: [
		// 	{
		// 		key: 'user',
		// 		storage: localStorage,
		// 		paths: ['name']
		// 	},
		// ],
		// strategies: [
		// 	{ storage: sessionStorage, paths: ['name'] },
		// 	{ storage: localStorage, paths: ['age'] },
		// ],
	},
	state: () => {
		return {
			user_info: {},
			userid: localStorage.getItem('userid') || '',
			role: localStorage.getItem('role') || '',
			user_loading: false,
			roleList: [
				{
					value: 0,
					name: '地推人员', 
				},
				{
					value: 1,
					name: '地推管理员', 
				}
			],
		};
	},
	getters: {
		roleName(state) {
			return state.roleList.find(item => item.value === +state.role)?.name || ''
		},
		roleMenus(state) {
			return state.roleList.find(item => item.value === +state.role)?.menus || []
		},
		renderMenus(state) { 
			console.log(state.role)
			return router.getRoutes()
					.filter(item => item.meta.menusFlag)
					.map(item => {
						let children = item.children
										.filter(item => item.meta.role.includes(+state.role))
										.map(item => ({title: item.meta.title, router_name: item.name, params: item.params})) 
						return {
							title: item.meta.title, 
							items: children
						}
					})
					
		}
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		setUserId(data) {
			this.userid = data.userid
			this.role = data.role
			localStorage.setItem('userid', data.userid)
			localStorage.setItem('role', data.role)
		},
		setUserInfo(data) {
			this.user_info = data  
			localStorage.setItem('user_info', data)
		},
		logout() {
			console.log('清除token 登录过期')
			// this.user_info = {}
			// this.setCookie('sunmaxx_st_company', '', 30)
			this.userid = ''
			this.role = ''
			this.user_info = {}
			localStorage.removeItem('userid')
			localStorage.removeItem('role')
			localStorage.removeItem('user_info')
			router.push({ name: 'login' })
		},
		// async getRoleData(needLoading = false) {
		// 	const res = await apis.getAccRole({ loading: needLoading });
		// 	if (res.code == 1) {
		// 		this.role = res.role 
		// 	}
		// }, 
		setCookie(name, value, days) {
			const d = new Date();
			d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
			const expires = "expires=" + d.toUTCString();
			document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
		}
	},
});
