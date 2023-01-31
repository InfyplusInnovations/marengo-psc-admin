<template>
    <div class="">
        <n-card class="" v-if="loading" title="Enrolls">
        <n-skeleton  text :repeat="6" />
      </n-card>
        <div class="" v-else>
          <n-p>
            <n-space>
             <div class="">Not Paid:</div> <n-switch v-model:value="unpaid" @update:value="handleUpaid" />
            </n-space>
          </n-p>
            <div class="" v-if="enrollError.error == true">
         <n-card>
          Error :  {{enrollError.msg}}, Try refreshing page
         </n-card>
          </div>
          <div class=" u-flex u-gap-2 u-flex-col" v-else-if="enrolls.length>0">
           
           <n-card title="Enrolls">
             <n-p>
              <n-space> 
               
               <n-button type="info" :disabled="selected.length!==1" @click="viewUser" >view user</n-button>
               <n-button type="primary" :disabled="selected.length!==1" @click="handleVerify" >verify payment</n-button>
              
            </n-space>
               
             </n-p>
             <n-data-table  :scroll-x="400"  :columns="columns" :data="enrolls"  v-model:checked-row-keys="selected" flex-height class="u-min-h-80" remote/>
           </n-card>
           <n-modal v-model:show="userDetails" class="u-max-w-72"    preset="card" title="User Details">
           <div class="" v-if="user">
            <n-space vertical>
              <div class="">Name: {{ user.first_name }} {{ user.last_name }}</div>
              <div class="">Phone: {{ user.phone }} </div>
              <div class="">Email: {{ user.email }} </div>
              <div class="">DOB: {{ user.dob }} </div>
              <div class="">Qulification: {{ user.qualification }} </div>
              <div class="">Address: {{ user.address }} </div>
            </n-space>
          </div>
          <div class="" v-else>
            No data found
          </div>
           </n-modal>
               </div>
         
           <div class="" v-else>
              <n-card>
             <n-space>
               No Enrolls available
              
             </n-space>
              </n-card>
           </div>
        </div>
    </div>
</template>
<script setup>
import {NP,NButton,NCard,NSpace,NDataTable ,NSkeleton,NSwitch,useMessage,useDialog,NModal} from 'naive-ui'
import { useEnrollStore } from '@/stores/enroll';
import { useUserStore } from '@/stores/user';

let loading = ref(false)
const dialog = useDialog();
const message = useMessage();
let unpaid = ref(true)
let userDetails = ref(false)
  const route = useRoute()
let enrollStore = useEnrollStore()
let userStore = useUserStore()

let enrollError = computed(()=>enrollStore.getResposnseStatus)
let enroll = computed(()=>enrollStore.getEnroll)
let user = computed(()=>userStore.getUser)
let enrolls = computed(()=>{
    
    let res = enrollStore.getEnrolls
  
    if(res){
        let data = res.map((enroll)=>({key:enroll.eId,eId:enroll.eId,transaction:enroll.payment_ref,paid:enroll.paid==true?'paid':'not paid'}))
       
    return data
    }else{
        return []
    }
})
let selected = ref([])
let columns = [{
          type: 'selection',
          options: [
            'all',
            'none']},
  {
    title:'eId',
    key:'eId',
    sorter: true,
  },
  {
    title:'transaction',
    key:'transaction',
    sorter: true,
  },
  {
    title:'paid',
    key:'paid',
    sorter: true,
  },
]
async function fetchData(){
    await enrollStore.fetchEnrolls(unpaid.value)
}

onMounted(async()=>{
    await fetchData()
})
async function handleUpaid(){
  await fetchData()
}
async function handleVerify(){
  dialog.warning({
          title: 'Confirm Verification',
          content: 'Are you sure?',
          positiveText: 'confirm',
          negativeText: 'cancel',
          onPositiveClick:()=> verfyPayment(),
          onNegativeClick: () => {
            message.error('Verification cancelled')
          }
        })
}
async function verfyPayment(){
  await enrollStore.fetchEnroll({eId:selected.value[0]})
  console.log(enroll.value)
  if(enroll.value.eId){
    let res = await enrollStore.verifyPayment({eId:enroll.value.eId})
    if(res == true){
      await fetchData()
      message.success('successfully verified')
      
    }else{
      message.success(enrollError.value.msg)
    }
  }else{
    message.warning('something went wrong try agian!')
  }

}
async function viewUser(){
  await enrollStore.fetchEnroll({eId:selected.value[0]})
  if(enroll.value.uId){
    let res = await userStore.fetchUser({uId:enroll.value.uId})
    if(res == true){
      userDetails.value = true
    }else{
      message.error('something went wrong try again')
    }
  }else{
    message.error('something went wrong try again')
  }
  
}



definePageMeta({
  title:'payment',
  middleware: "auth",
});
</script>