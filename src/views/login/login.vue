<template>
	<div class="grid min-h-svh lg:grid-cols-2 bg-gray-50">
		<div class="flex flex-col gap-4 p-6 md:p-10 ">
			<div class="flex flex-1 items-start justify-center">
				<div class="w-full max-w-xs pt-10">
					<!-- <Card class="w-full max-w-sm  border-purple-200" v-if="role === ''">
						<CardHeader>
							<CardTitle>
								<div class="flex flex-col items-center gap-1 text-center pt-10">
									<h1 class="text-2xl font-bold">地推管理系统</h1>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent class="pb-4">
							<div class="mb-4" v-for="item in roleList" :key="item.value">
								<div class="w-full bg-purple-50 p-10 text-center rounded-2xl text-primary text-xl flex flex-col items-center justify-center gap-2"
									@click="role = item.value">
									<div class="rounded-full p-2  bg-primary flex items-center justify-center gap-2 text-white size-10">
										<Users class="size-5" v-if="'0' === item.value" />
										<UserCog class="size-5" v-if="'1' === item.value" />
									</div>
									<span class="text-base">{{ item.label }}</span>
								</div>
							</div>
						</CardContent>
					</Card> -->
					<Card class="w-full max-w-sm  border-purple-200">
						<CardHeader>
							<CardTitle>
								<div class="flex flex-col items-center gap-1 text-center pt-4">
									<h1 class="text-2xl font-bold">运营商管理系统登录</h1>
								</div>
							</CardTitle>
							<!-- <CardDescription>
								Enter your email below to login to your account
							</CardDescription>
							<CardAction>
								<Button variant="link">Sign Up</Button>
							</CardAction> -->
						</CardHeader>
						<CardContent >
							<LoginForm :role="role" :uid="uid" />
						</CardContent>
						<!-- <CardFooter class="flex-col gap-2 border-t bg-indigo-50 [.border-t]:p-6 rounded-b-lg">
							<Button class="w-full bg-indigo-200 text-indigo-600  " @click="backHome">
								<ArrowLeftToLine class="size-5" />
								返回首页
							</Button>
						</CardFooter> -->
					</Card>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ArrowLeftToLine, Users, UserCog } from "lucide-vue-next";
import router from "@/router/guard"

const role = ref('')
const uid = ref('')
const roleList = ref([
	{
		value: '0',
		label: '地推人员'
	},
	{
		value: '1',
		label: '地推管理员'
	},
])
const roleLoginTitle = computed(() => {
	return roleList.value.find(item => item.value === role.value)?.label+'登录' 
})

watch(
	() => router.currentRoute.value.query.role,
	(n) => {
		if (n || n === '0') {
			role.value = n
		}
	},
	{
		immediate: true
	}
)
watch(
	() => router.currentRoute.value.query.uid,
	(n) => { 
		if (n || n === '0') {
			uid.value = n
		}
	},
	{
		immediate: true
	}
)

function backHome() {
	role.value = ''
}
</script>
