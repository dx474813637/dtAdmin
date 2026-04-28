import { createApp } from 'vue' 
// import uiPlugin from './plugins/ui.js';
// console.log(uiPlugin)
import { configure } from 'vee-validate' 
configure({
  validateOnBlur: false, // 不在失去焦点时验证
  validateOnInput: false, // 不在输入时验证
  validateOnChange: false, // 不在值变化时验证
  validateOnModelUpdate: true, // 仅在 v-model 更新时验证
})
import pinia from '@/stores/index.js';
import router from '@/router/guard'
import test from '@/utils/test'
// import * as icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './style.css'
// import '@/styles/element-override.scss'
import App from './App.vue'
import axios from '@/request/index'
import apis from '@/apis/index'
import defineDirectives from '@/directive/index'
import filters from '@/plugins/filters'
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$filters: Record<string, any>
	}
}
const app = createApp(App)
defineDirectives(app)
app.use(pinia)
app.use(router)
app.use(filters)
app.provide('$api', apis);
app.provide('$axios', axios);
app.provide('$test', test);
// app.use(uiPlugin, {
//   // 可选：覆盖默认 loading 配置
//   loading: {
//     color: '#007aff', // 修改为绿色
//     loader: 'dots',
//   },
// });
app.mount('#app')
// Object.keys(icons).forEach(key => {
// 	app.component(key, icons[key])
// })
export default app