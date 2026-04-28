<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div class="text-center mb-6 sm:mb-10">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">数据统计</h1>
                <p class="text-gray-500 text-sm sm:text-base">查看合伙人及推广用户数据</p>
            </div>

            <div class="mb-6 sm:mb-8">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">数据概况</h2>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6">
                    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">合伙人数</p>
                                <p class="text-xl sm:text-3xl font-bold text-indigo-600">{{ overviewData.hhr_total || 0
                                    }}</p>
                            </div>
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10h1v1H7V10Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">推广用户数</p>
                                <p class="text-xl sm:text-3xl font-bold text-emerald-600">{{ overviewData.member_total
                                    || 0 }}</p>
                            </div>
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                    <div>
                        <h2 class="text-lg sm:text-xl font-semibold text-gray-700">推广用户列表</h2>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span class="text-sm font-medium text-green-700">{{ user_pay || 0 }}人已支付</span>
                        </div>
                        <div class="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                            <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            <span class="text-sm font-medium text-indigo-600">{{ total || 0 }}人总推广</span>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="py-10 sm:py-16 text-center">
                    <div
                        class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white shadow-sm border border-gray-100">
                        <div class="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-indigo-500 mr-2">
                        </div>
                        <span class="text-gray-500 text-sm">加载中...</span>
                    </div>
                </div>

                <div v-else-if="error" class="py-10 sm:py-16 text-center">
                    <div
                        class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-red-50 shadow-sm border border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 sm:h-4 w-3 sm:w-4 text-red-500 mr-2"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-red-500 text-sm">{{ error }}</span>
                    </div>
                </div> 
                <div v-else-if="dataList.length === 0" class=" text-center">
                    <img :src="empty" alt="暂无数据" class="w-full max-w h-24 sm:h-32 object-contain mx-auto mb-4" />
                    <p class="text-gray-500 text-sm">暂无数据</p>
                </div>
                <div v-else class=" gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    <div v-for="item in dataList" :key="item.id"
                        class="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div class="flex items-center justify-between mb-3">
                            <span
                                class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium">
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
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
                                </svg>
                                <span class="text-sm text-gray-700">{{ item.mobile || '未填写' }}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                                </svg>
                                <span class="text-sm text-gray-500">{{ item.register_time || '未知' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!loading && loadstatus === 'nomore'" class="py-6 text-center">
                    <div
                        class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white shadow-sm border border-gray-100">
                        <span class="text-gray-500 text-sm">已加载全部数据</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import { useDataList } from '@/composition/useDataList.ts'
import { toRefs } from 'vue'
import router from '@/router'
import { baseStore } from '@/stores/main.js'

const base = baseStore()
const { empty } = toRefs(base)

const $api = inject('$api')

const role = ref(0)
const login = ref('')

const overviewData = ref({
    hhr_total: 0,
    member_total: 0
}) 
const user_pay = ref(0)

const error = ref('')
const type = ref('')

const api_config = computed(() => {
    return {
        list_api: type.value === 'cft' ? 'statistical2' : 'statistical',
        tj_api: type.value === 'cft' ? 'overview2' : 'overview',
    }
})

const options = computed(() => {
    return {
        params: {
            cate: role.value,
            login: login.value
        },
        api: api_config.value.list_api,
        getDataCallBack: (res) => {
            if (res.code === 1) {
                if (type.value === 'cft') {
                    dataList.value = [...dataList.value, ...res.list.list_ptp]
                    total.value = res.list.num_ptp || 0
                    user_pay.value = res.list.num_pay || 0
                } else {
                    dataList.value = [...dataList.value, ...res.list.data.list]
                    total.value = res.list.data.user_total || 0
                    user_pay.value = res.list.data.user_pay_total || 0
                }
                if (dataList.value.length >= total.value) {
                    loadstatus.value = 'nomore'
                } else {
                    loadstatus.value = 'loadmore'
                }
            }
        }
    }
})

const {
    dataList,
    loading,
    loadstatus,
    initDataList,
    setupScrollListener,
    total
} = useDataList(options)

watch(
    () => router.currentRoute.value.params.type,
    (newValue: any) => {
        type.value = newValue
        error.value = ''
        getOverview()
        initDataList()
    },
    { immediate: true, deep: true }
)

onMounted(() => {
    const cleanup = setupScrollListener()
    onUnmounted(cleanup)
})

async function getOverview() {
    try {
        const res = await $api[api_config.value.tj_api]({
            params: {
                cate: role.value,
                login: login.value
            }
        })

        if (res.code == 1) {
            if (type.value === 'red') {
                overviewData.value = {
                    hhr_total: res.list.data.hhr_total ?? 0,
                    member_total: res.list.data.member_total ?? 0
                }
            } else {
                overviewData.value = {
                    hhr_total: res.list.num_dy ?? 0,
                    member_total: res.list.num_partner ?? 0
                }
            }
        }
    } catch (e) {
        error.value = '数据加载失败'
        console.error(e)
    }
}
</script>
