<template>
	<div class="bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 mb-2">
		<template v-if="activeTab === 'cft'">
			<div class="flex items-center justify-between mb-3">
				<span class="text-sm sm:text-sm font-medium">账号: {{ item.dy_poster }}</span>
			</div>

			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span :class="[
						'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-sm sm:text-sm font-medium',
						item.is_gpt === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
					]">
						股票通：{{ item.is_gpt === 1 ? '付费会员' : '普通用户' }}
					</span>
				</div>

				<div class="flex items-center gap-2">
					<span :class="[
						'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-sm sm:text-sm font-medium',
						item.is_qht === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
					]">
						期货通：{{ item.is_qht === 1 ? '付费会员' : '普通用户' }}
					</span>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="flex items-center justify-between mb-3">
				<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium">
					ID: {{ item.id }}
				</span>
				<span :class="[
					'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium',
					item.user_pay_total === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
				]">
					{{ item.user_pay_total === 1 ? '付费会员' : '普通用户' }}
				</span>
			</div>

			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
					</svg>
					<span class="text-sm text-gray-700">{{ item.mobile || '未填写' }}</span>
				</div>

				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
					</svg>
					<span class="text-sm text-gray-500">{{ item.register_time || '未知' }}</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	item: any
	activeTab: string
}>()
</script>
