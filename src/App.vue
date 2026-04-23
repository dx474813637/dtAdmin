<template> 
	<router-view style="width: 100%;" :key="routerPath"></router-view>
</template>

<script setup lang="ts">
import router from "@/router/guard"  
watch(
	() => router.currentRoute.value,
	(newValue:any) => {
		// console.log(newValue.name) 
	},
	{immediate: true, deep: true}
)  

</script>
