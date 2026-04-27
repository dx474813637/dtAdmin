<template>
	<Sidebar v-bind="props" class="bg-white">
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" as-child>
						<a href="#">
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<GalleryVerticalEnd class="size-4" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-medium">地推系统</span>
								<span class="">
									<Badge variant="outline">
										<User data-icon="inline-end" />{{ roleName }}
									</Badge>
								</span>
							</div>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem v-for="item in list.navMain" :key="item.title">
						<SidebarMenuButton as-child>
							<a :href="item.url" class="font-medium" v-if="item.url">
								{{ item.title }}
							</a>
							<span class="font-medium" v-else-if="item.router_name"
								@click="router.push({ name: item.router_name })">
								{{ item.title }}
							</span>
							<span class="font-medium" v-else>
								{{ item.title }}
							</span>
						</SidebarMenuButton>
						<SidebarMenuSub v-if="item.items && item.items.length > 0">
							<SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
								<SidebarMenuSubButton as-child :is-active="childItem.isActive">
									<a :href="childItem.url" class="font-medium" v-if="childItem.url">
										{{ childItem.title }}
									</a>
									<span class="font-medium" v-else-if="childItem.router_name"
										@click="goRouter(childItem)">
										{{ childItem.title }}
									</span>
									<span class="font-medium" v-else-if="childItem.function == 'logout'"
										@click="user.logout()">
										{{ childItem.title }}
									</span> 
									<span class="font-medium" v-else>
										{{ childItem.title }}
									</span>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						</SidebarMenuSub>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
		<SidebarRail />
	</Sidebar>
</template>
<script setup lang="ts">
import router from "@/router/guard"
import type { SidebarProps  } from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar'
import { userStore } from '@/stores/user'
const user = userStore()
const { roleName, renderMenus } = user
import { GalleryVerticalEnd, User } from "lucide-vue-next"
const sidebar = useSidebar()
const props = defineProps<SidebarProps>()

// This is sample data.
const list = computed(() => ({
	navMain: [
		{
			title: "工作台",
			items: renderMenus
		},
		{
			title: "系统",
			items: [ 
				{
					title: "退出账号",
					function: 'logout'
				},
			],
		},
	],
})) 
function goRouter(item) { 
	router.push({ name: item.router_name }) 
	// console.log(sidebar)
	sidebar.setOpenMobile(false) 
	// emit('update:close', false)
}
</script>