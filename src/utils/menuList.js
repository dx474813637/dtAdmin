[ 
	{
		"label": "旺铺管理",
		"type": "title",
		"index": "1",
		"role": "[1, 2, 3, 4]",
		"icon": "icon-shiyanshifangjian", 
		"children": [
			{
				"label": "旺铺信息", 
				"icon": "",
				"index": "shop_info",  
				"role": "[1, 2, 3]",
				"route": {
					"name": "shop_info"
				}
			},
			{
				"label": "退货地址", 
				"icon": "",
				"index": "return_add", 
				"role": "[1, 2, 3, 4]",
				"route": {
					"name": "return_add"
				}
			},
			{
				"label": "发货地址", 
				"icon": "",
				"index": "send_address", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "send_address"
				}
			},
			{
				"label": "物流配置", 
				"icon": "",
				"index": "express_list", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "express_list"
				}
			},
			{
				"label": "资质证书", 
				"icon": "",
				"index": "qua_ce", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "qua_ce"
				}
			},
			{
				"label": "子账户列表", 
				"icon": "",
				"index": "sub_acc", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "sub_acc"
				}
			},
			{
				"label": "商品列表", 
				"icon": "",
				"index": "product_list", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "product_list"
				}
			}
		]
	},
	{
		"label": "订单中心",
		"type": "title",
		"index": "2",
		"role": "[1, 2, 3, 4]",
		"icon": "icon-gongyingshang",
		"children": [ 
			{
				"label": "订单管理",
				"icon": "",
				"index": "order_list", 
				"role": "[1, 2, 3, 4]",
				"route": {
					"name": "order_list"
				}  
			},
			{
				"label": "售后管理",
				"icon": "",
				"index": "service_list", 
				"role": "[1, 2, 3]",
				"route": {
					"name": "service_list"
				}  
			},
			{
				"label": "待发货订单",
				"icon": "", 
				"role": "[1, 2, 3]",
				"url": "https://www.sunmaxx.cn/User/down_order"
			},
			{
				"label": "快递单号上传",
				"icon": "", 
				"role": "[1, 2, 3]",
				"url": "https://www.sunmaxx.cn/User/up_order"
			},
			{
				"label": "销售明细下载",
				"icon": "", 
				"role": "[1, 2, 3]",
				"url": "https://www.sunmaxx.cn/User/down_order2"
			},
			{
				"label": "客户开票申请",
				"icon": "", 
				"index": "invoice_list",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "invoice_list"
				}  
			}
		]
	}, 
	{
		"label": "运营管理",
		"type": "title",
		"index": "yy",
		"icon": "icon-weituodantongji",
		"role": "[1, 2, 3]",
		"children": [
			{
				"label": "合伙人管理", 
				"icon": "",
				"index": "workers_list2",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "workers_list2"
				}
			},
			{
				"label": "绑定合伙人", 
				"icon": "",
				"index": "workers_add2", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "workers_add2"
				}
			}
		]
	}, 
	{
		"label": "结算中心",
		"type": "title",
		"index": "zj",
		"icon": "icon-baojiadan",
		"role": "[1, 2, 3]", 
		"children": [
			{
				"label": "提现账户绑定", 
				"icon": "",
				"index": "out_pay_bind", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "out_pay_bind"
				}
			}, 
			{
				"label": "资金中心", 
				"icon": "",
				"index": "order_statement_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "order_statement_list"
				} 
			}, 
			{
				"label": "结算下载", 
				"icon": "",
				"role": "[1, 2, 3]", 
				"url": "https://www.sunmaxx.cn/User/down_statement" 
			},
			{
				"label": "保证金账户", 
				"icon": "",
				"index": "bond_list",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "bond_list"
				}
			}, 
			{
				"label": "福利中心", 
				"icon": "",
				"index": "vouchers_statement_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "vouchers_statement_list"
				} 
			}
		]
	}, 
	{
		"label": "微信结算",
		"type": "title", 
		"index": "wxzf",
		"role": "[1, 2, 3]",  
		"icon": "icon-shiyanshikaohe",
		"children": [
			{
				"label": "支付账户", 
				"icon": "", 
				"index": "applyments_index",  
				"role": "[1, 2, 3]", 
				"route": {
					"name": "applyments_index"
				} 
			},
			{
				"label": "开票信息", 
				"icon": "",
				"role": "[1, 2, 3]", 
				"url": "https://www.sunmaxx.cn/User/kaipiao" 
			},
			{
				"label": "分账账单下载",
				"icon": "", 
				"role": "[1, 2, 3]",
				"url": "https://www.sunmaxx.cn/User/down_order3"
			},
			{
				"label": "服务分账", 
				"icon": "", 
				"index": "profitsharing",  
				"role": "[1, 2, 3]", 
				"route": {
					"name": "profitsharing"
				} 
			}
		]
	}, 
	{
		"label": "社区团购管理",
		"type": "title", 
		"index": "sqtg",
		"role": "[1, 2, 3, 4]", 
		"community": "1",
		"icon": "icon-kehuguanli",
		"children": [
			{
				"label": "团长管理", 
				"icon": "", 
				"index": "community_list", 
				"community": "1",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "community_list"
				} 
			},
			{
				"label": "自提点管理", 
				"icon": "", 
				"index": "address_list", 
				"community": "1",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "address_list"
				} 
			},
			{
				"label": "发货清单", 
				"icon": "", 
				"index": "community_goods_list", 
				"community": "1",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "community_goods_list"
				} 
			},
			{
				"label": "订单管理", 
				"icon": "", 
				"index": "order_list2", 
				"community": "1",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "order_list2"
				} 
			},
			{
				"label": "退货记录", 
				"icon": "", 
				"index": "community_refund_list", 
				"community": "1",
				"role": "[1, 2, 3]", 
				"route": {
					"name": "community_refund_list"
				} 
			}
		]
	}, 
	{
		"label": "优惠活动管理",
		"type": "title", 
		"index": "yhhd",
		"role": "[1, 2, 3, 4]", 
		"icon": "icon-daibanshiwu",
		"children": [
			{
				"label": "活动列表", 
				"icon": "", 
				"index": "coupon_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "coupon_list"
				} 
			} 
		]
	}, 
	{
		"label": "福利券中心",
		"type": "title",
		"wx": "1",
		"index": "5",
		"role": "[1, 2, 3, 4]", 
		"icon": "icon-yiqifenlei",
		"children": [
			{
				"label": "福利券申请", 
				"icon": "",
				"wx": "1",
				"index": "welfare", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "welfare"
				} 
			},
			{
				"label": "福利券记录", 
				"icon": "",
				"wx": "1",
				"index": "welfare_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "welfare_list"
				} 
			},
			{
				"label": "开票记录", 
				"icon": "",
				"wx": "1",
				"index": "welfare_invoice_list", 
				"role": "[1, 2, 3]", 
				"route": {
					"name": "welfare_invoice_list"
				} 
			}
		]
	}, 
	{
		"label": "账户管理",
		"type": "title", 
		"index": "3",
		"wx": "1",
		"role": "[1, 2, 3, 4]", 
		"icon": "icon-quanxianguanli",
		"children": [
			{
				"label": "修改密码", 
				"icon": "",
				"index": "change_psw", 
				"role": "[1, 2, 3, 4]", 
				"route": {
					"name": "change_psw"
				}
			},
			{
				"label": "退出登录",  
				"role": "[1, 2, 3, 4]", 
				"wx": "1",
				"url": "https://www.sunmaxx.cn/Index/logout",
				"linkWay": "replace"
			},
			{
				"label": "旺铺协议", 
				"role": "[1, 2, 3, 4]", 
				"url": "https://www.sunmaxx.cn/Index/sh.html",
				"linkWay": "open"
			}
		] 
	}
]