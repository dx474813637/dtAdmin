<!--  -->
<template>
	<div class="grid min-h-svh lg:grid-cols-1 bg-gray-50">
		<div class="flex flex-col gap-4 p-6 md:p-10 ">
			<div class="flex flex-1 items-start justify-center">
				<div class="w-full max-w-md pt-10">
					<Card class="w-full max-w-md  border-purple-200">
						<CardHeader>
							<CardTitle>
								<div class="flex flex-col items-center gap-1 text-center pt-4">
									<h1 class="text-2xl font-bold">重置密码</h1>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form @submit="onSubmit" class="flex flex-col gap-6">
								<FormField v-slot="{ componentField }" name="mobile">
									<FormItem>
										<FieldLabel for="mobile">
											<Smartphone class="size-4 text-slate-500" />手机号 
										</FieldLabel>
										<FormControl>
											<Input disabled type="text" id="mobile" placeholder="请输入手机号"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<FormField v-slot="{ componentField }" name="captcha">
									<FormItem>
										<div class="flex items-center justify-between">
											<FieldLabel for="captcha">
												<Mail class="size-4 text-slate-500" />验证码
												<span class="text-destructive">*</span>
											</FieldLabel>
											<Button id="getCode" type="button" class="" variant="link" size="sm"
												:disabled="codeLoading || countdown > 0" :loading="codeLoading"
												@click="getCode">
												<Spinner data-icon="inline-start" v-if="codeLoading" />
												<Send class="size-4" v-else />
												<span v-if="countdown > 0">{{ countdown }}秒后重新获取</span>
												<span v-else>获取验证码</span>
											</Button>
										</div>
										<FormControl>
											<Input type="text" id="captcha" placeholder="请输入验证码"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<FormField v-slot="{ componentField }" name="passwd">
									<FormItem>
										<FieldLabel for="passwd">
											<Lock class="size-4 text-slate-500" />新密码
											<span class="text-destructive">*</span>
										</FieldLabel>
										<FormControl>
											<Input type="password" id="passwd" placeholder="请输入新密码"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<FormField v-slot="{ componentField }" name="npasswd">
									<FormItem>
										<FieldLabel for="npasswd">
											<Lock class="size-4 text-slate-500" />确认新密码
											<span class="text-destructive">*</span>
										</FieldLabel>
										<FormControl>
											<Input type="password" id="npasswd" placeholder="请确认新密码"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
								<Field>
									<Button type="submit" :loading="submitLoading"
										:disabled="submitLoading">重置密码</Button>
								</Field>
								<Field>
									<Button variant="outline" class=" bg-indigo-50 border-indigo-50 text-indigo-600"
										type="button" @click="goBack">
										<ArrowLeftToLine class="size-4" />
										返回登录
									</Button>
								</Field>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, inject, computed, onMounted } from 'vue'
import router from "@/router/guard"
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeftToLine, Smartphone, Lock, Mail, Send } from "lucide-vue-next"
import { userStore } from '@/stores/user';
const user = userStore()
const { user_info } = toRefs(user)

const $api = inject('$api')
const $test = inject('$test')

const formSchema = toTypedSchema(
	z.object({
		mobile: z.string()
			.min(1, '不能为空')
			.refine(
				(value) => $test.mobile(value),
				{ message: '请输入正确的手机号' }
			),
		captcha: z.string().min(1, '不能为空'),
		passwd: z.string().min(6, '密码至少需要6个字符'),
		npasswd: z.string().min(6, '确认密码至少需要6个字符')
			.refine(
				(value) => value === values.passwd,
				{ message: '两次输入的密码不一致' }
			)
	})
)

const { handleSubmit, values, validateField, handleReset, setFieldValue } = useForm({
	defaultValues: { mobile: "", captcha: "", passwd: "", npasswd: "" },
	validationSchema: formSchema,
})

const codeLoading = ref(false)
const submitLoading = ref(false)
const countdown = ref(0)

function goBack() {
	router.push({ name: 'login' })
}

// 初始化手机号为当前登录用户的login值
onMounted(() => {
	// 从user store中获取用户信息 
	// 如果有用户信息且有login字段，设置为手机号默认值
	// if (user_info.value && user_info.value.login) {
	// 	setValues('mobile', user_info.value.login)
	// }
})

watch(
	() => user_info.value,
	(newVal) => {
		if (newVal && newVal.login) {
			console.log(newVal.login)
			nextTick(() => {
				setFieldValue('mobile', newVal.login)
			})
		}
	},
	{ immediate: true, deep: true }
)




async function getCode() {
	const result = await validateField('mobile')
	if (!result.valid) return ElMessage.error({ message: result.errors, offset: 50 })
	if (codeLoading.value || countdown.value > 0) return
	codeLoading.value = true
	try {
		const res = await $api.get_captcha({
			params: {
				mode: 'forget',
				mobile: values.mobile
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

const onSubmit = handleSubmit(async (values) => {
	if (submitLoading.value) return
	submitLoading.value = true
	try {
		const res = await $api.passwd_reset({
			params: {
				...values
			}
		})
		if (res.code == 1) {
			submitLoading.value = false
			ElMessage.success({ message: res.msg, offset: 50 })
			router.push({ name: 'login' })
		}
	} catch (error) {
		ElMessage.error({ message: error.message, offset: 50 })
		submitLoading.value = false
		return false
	}
})
</script>
<style lang='scss' scoped></style>