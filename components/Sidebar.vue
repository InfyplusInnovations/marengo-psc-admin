<template>
    <n-layout-sider :collapsed="collapsed" class="bg-white" bordered accordion   collapse-mode="width"  
    :collapsed-width="64">
        <div class="">
            <logo :collapsed="collapsed"/>
        </div>
        <n-menu :options="options"  :value="currentPath" />
    </n-layout-sider>
</template>

<script setup>
import {NLayoutSider,NMenu,NIcon} from 'naive-ui'
import { RouterLink } from 'vue-router'
import { h } from 'vue';
function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h('div',{class:icon}) })
}

let route = useRoute()
let currentPath = computed(()=>route.meta.title)

const options = [{
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/',
            
          }
        },
        { default: () => 'Home' }
      ),
      path:'/',
    key:'home',
    // icon: ()=>h('div',{
    //     class:'i-carbon-sun'
    // },h('div'))
    icon:renderIcon('i-carbon-home')
},
{
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/test',
          }
        },
        { default: () => 'Tests' }
      ),
    key:'test',
    path:'/tests',
    // icon: ()=>h('div',{
    //     class:'i-carbon-sun'
    // },h('div'))
    icon:renderIcon('i-carbon-document-preliminary')
},{
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/payment',
          }
        },
        { default: () => 'payments' }
      ),
    key:'payment',
    path:'/payment',
    // icon: ()=>h('div',{
    //     class:'i-carbon-sun'
    // },h('div'))
    icon:renderIcon('i-carbon-money')
},
{
    label:()=>h('div',{
        onClick:()=>logout(),
        innerHTML: 'logout'
    }),
    key:'logout',
    // icon: ()=>h('div',{
    //     class:'i-carbon-sun'
    // },h('div'))
    icon: ()=>h(renderIcon('i-carbon-logout'),{onClick:()=>logout()})
}]
const supabase = await useSupabaseClient()
async function logout(){
    const { error } = await supabase.auth.signOut()
    if(error == null){
        navigateTo('/login')
    }
}
defineProps({
    collapsed:Boolean
})


</script>