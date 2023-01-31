<template>

  <n-layout has-sider class="u-h-screen" >
    <sidebar :collapsed="collapsed"  />
    <n-layout-content  :native-scrollbar="false"  class="u-bg-gray-200 u-h-full"  >
      <navbar @menuChange = "changeMenu"  />
 
 <div class="u-p-3">
  <slot/>
 </div>


  </n-layout-content>
 
</n-layout>


  </template>
  <script setup>
import {NButton,NSpace,NLayout,NLayoutContent} from 'naive-ui'

let collapsed = ref(true)


onMounted(()=>{

  if(window.innerWidth>900){
 
    collapsed.value=false 
  }
 })
const changeMenu = ()=>{

  collapsed.value = !collapsed.value
  

}
async function logout(){
  
}
</script>