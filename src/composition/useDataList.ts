import { ref, computed, inject, onMounted, onUnmounted } from 'vue'

export interface UseDataListOptions {
  params?: Record<string, any>
  api: string
  noReach?: boolean
  getDataCallBack?: (res: any) => void
}

export function useDataList(data: UseDataListOptions) {
  const $api = inject('$api') as Record<string, (params: any) => Promise<any>>
  const dataList = ref<any[]>([])
  const curP = ref(1)
  const total = ref(0)
  const loadstatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')
  const loading = ref(false)
  
  const params = computed(() => {
    return {
      p: curP.value,
      ...data.params
    }
  })
  
  function initDataListParams() {
    curP.value = 1
    dataList.value = []
  }
  
  async function initDataList() {
    loading.value = true
    initDataListParams()
    await getDataList()
    loading.value = false
  }
  
  async function getMoreDataList() {
    if (loadstatus.value !== 'loadmore') return
    loadstatus.value = 'loading'
    curP.value++
    await getDataList()
  }
  
  async function getDataList() {
    try {
      const res = await $api[data.api]({ params: params.value })
      if (data.getDataCallBack) {
        data.getDataCallBack(res)
      } else {
        if (res.code === 1) {
          dataList.value = [...dataList.value, ...res.list]
          total.value = res.total || 0
          if (dataList.value.length >= res.total) {
            loadstatus.value = 'nomore'
          } else {
            loadstatus.value = 'loadmore'
          }
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 滚动触底检测
  function handleScroll() {
    if (data.noReach) return
    if (loadstatus.value !== 'loadmore') return
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const clientHeight = document.documentElement.clientHeight || window.innerHeight
    
    // 当滚动到距离底部100px时触发
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getMoreDataList()
    }
  }
  
  // 设置滚动监听器
  function setupScrollListener() {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }
  
  return {
    dataList,
    curP,
    loadstatus,
    loading,
    total,
    params,
    getDataList,
    initDataListParams,
    initDataList,
    getMoreDataList,
    setupScrollListener
  }
}
