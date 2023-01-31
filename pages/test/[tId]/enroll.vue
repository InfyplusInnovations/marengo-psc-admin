<template>
    <n-card title="Enroll">
        <n-skeleton  text :repeat="6" v-if="loading==true" />
       <div class="" v-else>
       <div class="" v-if="testError.error == true">
        {{ testError.msg }}
    </div>
    <div class="" v-else-if="test == null">
        Test does not exist!
    </div>
    <n-tabs v-else type="line" animated v-model:value="tab"  @before-leave="handleBeforeLeave">
            <n-tab-pane name="enroll" tab="Enroll">
                <n-card :title="test.title">
                    <div class="">
                        <span class="u-font-bold">Price: </span> {{ test.price }}
                    </div>
                    <div class="">
                        <span class="u-font-bold">Start Date: </span> {{ test.startDate }}
                    </div>
                    <div class="">
                        <span class="u-font-bold">End Date: </span> {{ test.endDate }}
                    </div>
                    <template #action>
                        <n-button type="primary" @click="handleEnroll">Enroll</n-button>
                    </template>
                </n-card>
            </n-tab-pane>
            <n-tab-pane name = "payment" tab="Payment">

            </n-tab-pane>
            <n-tab-pane name = "complete" tab="Complete">
                <n-alert title="Successfully enrolled" type="success">
            Sucess you have successfully enrolled in this test series<n-button quaternary  class="u-text-blue-500 u-cursor-pointer" @click="navigateTo(`/test/${test.tId}`)">Go to Test</n-button>
    </n-alert>
            </n-tab-pane>
        </n-tabs>
       </div>
    </n-card>

</template>
<script setup>
import {NCard,NTabs,NTabPane,NSkeleton,NButton,NAlert} from 'naive-ui'
import { useTestStore } from '@/stores/test';
import { useEnrollStore } from '@/stores/enroll';
let loading = ref(false)
let tab=ref("enroll")

const testStore = useTestStore()
const enrollStore = useTestStore()
let route = useRoute()
let test = computed(()=>testStore.getTest)
let testError = computed(()=>testStore.responseStatus)
let enrollError = computed(()=>enrollStore.responseStatus)
async function fetchData(){
    
await testStore.fetchTest({tId:route.params.tId})

}
function handleBeforeLeave(tabString){
   
    switch(tabString){
        case 'enroll':
            return test.value.enrolled ==false  
        case 'payment':
        return test.value.enrolled == true && test.value.paid == false
        case 'complete':
          return test.value.paid == true && test.value.enrolled == true
        default:
            return true
    }

}
onMounted(async()=>{
await fetchData()
if(test.value!==null||test.value!==undefined){
    if(test.value.paid == true){
tab.value='complete'
    }else if(test.value.enrolled==true){
tab.value='payment'
    }else{
        tab.value= 'enroll'
    }
}
})
async function handleEnroll(){
    let res = await enrollStore.enrollStudent({
        tId:test.value.tId
    })

}
</script>