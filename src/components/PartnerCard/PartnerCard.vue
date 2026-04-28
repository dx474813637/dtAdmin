<template>
    <div :class="[
        'bg-white shadow-sm transition-all duration-300',
        'rounded-2xl overflow-hidden hover:shadow-lg transform hover:-translate-y-1'
    ]" >
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">{{ item.name?.charAt(0) || '合' }}</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">{{ item.name || '未设置' }}</h3>
                        <p class="text-sm text-gray-500">{{ item.user }}</p>
                    </div>
                </div>
                <div class="flex-shrink-0 flex flex-col items-center gap-1" v-if="!simplified">
                    <span class="px-2.5 py-1 rounded-full text-sm font-medium cursor-pointer" :class="{
                        'bg-green-100 text-green-800': item.img,
                        'bg-red-100 text-red-800': !item.img
                    }" @click.stop="handleUploadImage">
                        {{ item.img ? '查看台签' : '上传台签' }}
                    </span>
                    <span v-if="item.haibao"
                        class="px-2.5 py-1 rounded-full text-sm font-medium cursor-pointer bg-purple-100 text-primary"
                        @click.stop="handlePreviewHaibao">
                        查看海报
                    </span>
                </div>
            </div>
            <template v-if="!simplified">
                <div v-if="item.company" class="mb-2 flex items-start gap-2">
                    <Building2 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
                    <p class="text-sm text-gray-600 leading-relaxed">{{ item.company }}</p>
                </div>
                <div v-if="item.address" class="mb-2 flex items-start gap-2">
                    <MapPinned class="shrink-0 size-4 text-indigo-400 mt-0.5" />
                    <p class="text-sm text-gray-600 leading-relaxed">{{ item.address }}</p>
                </div>
                <div v-if="item.info" class="mb-2 flex items-start gap-2">
                    <Bookmark class="shrink-0 size-4 text-indigo-400 mt-0.5" />
                    <p class="text-sm text-gray-600 leading-relaxed">{{ item.info }}</p>
                </div>
                <div v-if="item.ctime" class="mb-2 flex items-start gap-2">
                    <Clock8 class="shrink-0 size-4 text-indigo-400 mt-0.5" />
                    <p class="text-sm text-gray-600 leading-relaxed">{{ item.ctime }}</p>
                </div>

            </template>

            <div class="flex gap-3 mt-3">
                <template v-if="simplified"> 
                    <Button variant="default" size="sm" class="flex-1" @click="handleClick">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        查看数据统计
                    </Button>
                </template>
                <template v-else>
                    <Button variant="secondary" size="sm" class="flex-1" @click="handleEditRemark">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        备注信息
                    </Button>
                    <Button variant="default" size="sm" class="flex-1" @click="handleBindPartner">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        物料申请
                    </Button>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Building2, MapPinned, Bookmark, Clock8 } from "lucide-vue-next"
import { Button } from '@/components/ui/button'

const props = defineProps<{
    item: any
    simplified?: boolean
}>()

const emit = defineEmits(['upload-image', 'preview-haibao', 'edit-remark', 'bind-partner', 'click'])

const handleUploadImage = () => {
    emit('upload-image', props.item)
}

const handlePreviewHaibao = () => {
    emit('preview-haibao', props.item)
}

const handleEditRemark = () => {
    emit('edit-remark', props.item)
}

const handleBindPartner = () => {
    emit('bind-partner', props.item)
}

const handleClick = () => {
    emit('click', props.item)
}
</script>
