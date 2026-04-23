import axios from '@/request/index';
// login  登录接口  参数cate=1 密码登录 0或不传 验证码登录 login账号 passwd密码  captcha验证码  密码和验证码只要传对应方式的参数 uid参数  这个参数只会在url地址栏里传递 接收到uid就传
                    //返回role ，0=地推人员 1=地推管理员 
export const login = (data) => axios.get('Dituiapi/login', data) 
// get_captcha 获取验证 参数mode=login、regist、forget  mobile手机号
export const get_captcha = (data) => axios.get('Dituiapi/get_captcha', data)
// passwd_reset 重置密码  验证码修改密码（忘记密码） passwd新密码 npasswd重复新密码  captcha验证码
export const passwd_reset = (data) => axios.get('Dituiapi/passwd_reset', data) 
// 就是用财富通登录接口  login接口会返回userid  记本地缓存，其他接口都要用到。一样头部传递 


// promotions 单页列表 参数p 返回的total总数  total2已分发  total3已使用
export const promotions = (data) => axios.get('Dituiapi/promotions', data) 
// add_promotions 绑定合伙人接口 参数numa开始序号 numb结束序号 login合伙人账号（这个是从合伙人列表进的，不需要填写。）
export const add_promotions = (data) => axios.get('Dituiapi/add_promotions', data) 
// info 用户信息  **地推人员和地推管理员  共用的 其实所有地推人员的接口，管理员都能用。**
export const info = (data) => axios.get('Dituiapi/info', data) 
// edit_info 编辑用户信息 参数name 姓名
export const edit_info = (data) => axios.get('Dituiapi/edit_info', data) 
// partner 合伙人列表 参数p
export const partner = (data) => axios.get('Dituiapi/partner', data)  
// edit_partner 合伙人标签  参数info
export const edit_partner = (data) => axios.get('Dituiapi/edit_partner', data) 
// material 物料申请列表 参数p
export const material = (data) => axios.get('Dituiapi/material', data) 
// add_material 申请物料（台签架） 参数num 数量
export const add_material = (data) => axios.get('Dituiapi/add_material', data) 
 

// 地推管理员接口
// ditui  地推人员列表 参数p terms  姓名手机搜索
export const ditui = (data) => axios.get('Dituiapi/ditui', data) 
// add_promotions2 给地推人员生成单页 参数 num 生成数，最多一次生成20个 login 地推人员账号（从地推人员列表进入，不需要填写）
export const add_promotions2 = (data) => axios.get('Dituiapi/add_promotions2', data) 
// material2 物料申请列表 参数p
export const material2 = (data) => axios.get('Dituiapi/material2', data) 
// material_shenhe 物料申请审核 参数id申请id zt=1 通过 2拒绝
export const material_shenhe = (data) => axios.get('Dituiapi/material_shenhe', data) 

  