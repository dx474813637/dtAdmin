<template>
	<form @submit="onSubmit" :class="cn('flex flex-col gap-6', props.class)">
		<FormField v-slot="{ componentField }" name="login">
			<FormItem>
				<FieldLabel for="login">
					<template v-if="logintype === 1">
						<CircleUserRound class="size-4 text-slate-500" />用户名
					</template>
					<template v-else>
						<Smartphone class="size-4 text-slate-500" />手机号
					</template>
					<span class="text-destructive">*</span>
				</FieldLabel>
				<FormControl>
					<Input type="text" id="login" placeholder="请输入用户名" v-bind="componentField" />
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="passwd" v-if="logintype === 1">
			<FormItem>
				<div class="flex items-center">
					<FieldLabel for="password">
						<Lock class="size-4 text-slate-500" />密码
						<span class="text-destructive">*</span>
					</FieldLabel>
					<span class="ml-auto text-sm underline-offset-4 hover:underline text-gray-400"
						@click="changeLoginType">
						忘记密码?
					</span>
				</div>
				<FormControl>
					<Input type="password" id="password" placeholder="请输入密码" v-bind="componentField" />
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="captcha" v-if="logintype === 0">
			<FormItem>
				<div class="flex items-center justify-between">
					<FieldLabel for="captcha">
						<Mail class="size-4 text-slate-500" />验证码
						<span class="text-destructive">*</span>
					</FieldLabel>
					<Button id="getCode" type="button" class="" variant="link" size="sm"
						:disabled="codeLoading || countdown > 0" :loading="codeLoading" @click="getCode">
						<Spinner data-icon="inline-start" v-if="codeLoading" />
						<Send class="size-4" v-else />
						<span v-if="countdown > 0">{{ countdown }}秒后重新获取</span>
						<span v-else>获取验证码</span>
					</Button>
				</div>
				<FormControl>
					<Input type="text" id="captcha" placeholder="请输入验证码" v-bind="componentField" />
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<Field>
			<Button type="submit" :loading="submitLoading" :disabled="submitLoading">登 录</Button>
		</Field>
		<FieldSeparator>其他方式</FieldSeparator>
		<Field>
			<Button variant="outline" class=" bg-indigo-50 border-indigo-50 text-indigo-600" type="button"
				@click="changeLoginType">
				<template v-if="logintype === 1">
					<Smartphone class="size-4" />
					验证码登录
				</template>
				<template v-else>
					<Lock class="size-4" />
					密码登录
				</template>
			</Button>
			<FieldDescription class="text-center" v-if="logintype === 1">
				没有账号?
				<span class="text-red-400" @click="changeLoginType">立即注册</span>
			</FieldDescription>
		</Field>
	</form>
</template>


<script setup lang="ts">
import router from "@/router/guard"
import { userStore } from '@/stores/user'
const user = userStore()
const { role, userid } = toRefs(user)
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils'
import { Input } from "@/components/ui/input"
import { Smartphone, CircleUserRound, Lock, Mail, Send, CircleX } from "lucide-vue-next";
const props = defineProps<{
	class?: HTMLAttributes["class"],
	role: {
		type: String,
		default: '0'
	},
	uid: {
		type: String,
		default: ''
	}
}>()
const $api = inject('$api')
const $test = inject('$test')
const login = ref('')
const passwd = ref('')
const captcha = ref('')
const logintype = ref(1)
const formSchemaPasswd = toTypedSchema(
	z.object({
		login: z.string().min(1, '账号不能为空'),
		passwd: z.string().min(1, '不能为空'),
		// captcha: z.string().min(8, { message: '密码至少需要8个字符。' }),
	})
)
const formSchemaPhone = toTypedSchema(
	z.object({
		login: z.string()
			.min(1, '不能为空')
			.refine(
				(value) => $test.mobile(value),
				{ message: '请输入正确的手机号' }
			),
		captcha: z.string().min(1, '不能为空'),
	})
)
const formSchema = computed(() => {
	if (logintype.value === 1) return formSchemaPasswd
	return formSchemaPhone
})
const { handleSubmit, values, validateField, handleReset } = useForm({
	defaultValues: { login: "", passwd: "", captcha: "" },
	validationSchema: formSchema,
})
const codeLoading = ref(false)
const submitLoading = ref(false)
const countdown = ref(0)

function changeLoginType() {
	// console.log(form)
	// form.setValidationSchema(formSchema.value)
	logintype.value = 1 - logintype.value
	handleReset()
}
const onSubmit = handleSubmit(async (values) => {
	console.log('表单提交成功！', values)
	// 在这里发送你的API请求...
	if (submitLoading.value) return
	// 模拟获取验证码
	submitLoading.value = true
	try {
		const res = await $api.login({
			params: {
				cate: logintype.value,
				role: props.role,
				uid: props.uid,
				...values
			}
		})
		if (res.code == 1) {
			submitLoading.value = false
			user.setUserId(res)
			router.push({name: 'userInfo'})
			ElMessage.success({ message: res.msg, offset: 50 })
		}
	} catch (error) {
		ElMessage.error({ message: error.message, offset: 50 })
		submitLoading.value = false
		return false
	}
})
async function getCode() {
	const result = await validateField('login')
	if (!result.valid) return ElMessage.error({ message: result.errors, offset: 50 })
	// if(!$test.mobile(form.value.login)) {
	// 	ElMessage.error({message: '请输入正确的手机号', offset: 50 })
	// 	return false
	// }
	if (codeLoading.value || countdown.value > 0) return
	// 模拟获取验证码
	codeLoading.value = true
	try {
		const res = await $api.get_captcha({
			params: {
				mode: 'login',
				mobile: values.login
			}
		})
		if (res.code == 1) {
			codeLoading.value = false
			countdown.value = 60
			const timer = setInterval(() => {
				countdown.value--
				if (countdown.value <= 0) {
					clearInterval(timer)
				}
			}, 1000)
			ElMessage.success({ message: '验证码已发送', offset: 50 })

		}
	} catch (error) {
		ElMessage.error({ message: error.message, offset: 50 })
		codeLoading.value = false
		return false
	}

}
</script>