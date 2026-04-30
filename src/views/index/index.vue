<!--  -->
<template>
	<SidebarProvider>
		<AppSidebar  /> 
		<main class="pt-14 w-full max-w-7xl mx-auto">
			<nav
				class="fixed top-0 left-0 right-0 h-14 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
				<div class="flex items-center gap-2">
					<div
						class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<GalleryVerticalEnd class="size-4" />
					</div>
					<span class="text-lg font-semibold">运营商管理系统</span>
					<span class="text-sm text-gray-600">/ {{ title }}</span>
				</div>
				<SidebarTrigger class="size-6" />
			</nav>
			<router-view style="width: 100%;" :key="routerPath"></router-view>
			<SafeArea class="bg-white" />
		</main> 

	</SidebarProvider>
</template>

<script setup lang="ts">
import { GalleryVerticalEnd } from "lucide-vue-next"
import { useSettingsStore } from "@/stores/settings"
import router from "@/router/guard"
import { SafeArea } from "@/components/ui/safe-area" 

const settings = useSettingsStore()
const { title } = toRefs(settings)
watch(
	() => router.currentRoute.value,
	(newValue: any) => {
		console.log(newValue.name)
	},
	{ immediate: true, deep: true }
) 
</script>
<style lang="scss" scoped></style>
