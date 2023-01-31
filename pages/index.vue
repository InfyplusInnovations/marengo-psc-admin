<template>
<div class="">
  <n-card class="" v-if="loading" title="Enrolls">
        <n-skeleton  text :repeat="6" />
      </n-card>
      <div class="" v-else>
  
  <div class="" v-if="stats">
   <n-space>
     <n-card><n-statistic label="enrolls">{{ stats.enroll }}</n-statistic> <n-button type="primary" @click="navigateTo('/payment')">view</n-button></n-card>
     <n-card><n-statistic label="tests">{{stats.tests}}</n-statistic> <n-button type="primary" @click="navigateTo('/test')">view</n-button></n-card>
     
</n-space>
 </div>
<div class="" v-else>
 <n-card title="Statistics">
   No Statistics found, try reloading
 </n-card>
</div>
</div>
</div>

</template>
<script setup>
import {NCard,NStatistic,NSpace,NButton,NSkeleton} from 'naive-ui'
import {useStatsStore} from '../stores/stats'

let statsStore = useStatsStore()
let stats = computed(()=>statsStore.getStats)
let loading = ref(false)
onMounted(async()=>{
  loading.value = true
  await statsStore.fetchStats()
  loading.value = false
})
definePageMeta({
  title:'home',
  middleware: "auth",
});
</script>
