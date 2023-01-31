<template>
  <div class="">
    <div class="">
    <n-card class="" v-if="loading" title="Tests">
      <n-skeleton  text :repeat="6" />
    </n-card>
  <div class="" v-else>
    <div class="" v-if="testsError.error == true">
        Error :  {{testsError.msg}}, Try refreshing page
        </div>
        <div class=" u-flex u-gap-2 u-flex-col" v-else-if="tests.length>0">
         
        <n-card title="Tests">
          <n-p>
           <n-space> <n-button type="primary" @click="addModal=true">add</n-button>
            <n-button type="warning" :disabled="selected.length!==1" @click="handleEdit">edit</n-button>
           
            <n-button type="error" :disabled="selected.length<1" @click="confirmDelete">delete</n-button>
            <n-button type="info" :disabled="selected.length!==1" @click="handleExam">view exams</n-button></n-space>
            
          </n-p>
          <n-data-table :scroll-x="720"  :columns="columns" :data="tests"  v-model:checked-row-keys="selected" :pagination="pagination" :on-update:checked-row-keys="handleSelect"  flex-height class="u-min-h-80" remote/>
        </n-card>
            </div>
      
        <div class="" v-else>
            No tests available
        </div>
        <n-modal v-model:show="addModal"
    :mask-closable="false"  preset="card"
    class="u-max-w-82"
    title="Add Test">
<n-form>
  <n-form-item label="Title*">
    <n-input placeholder="Enter test title" v-model:value="addForm.title"/>
  </n-form-item>
  <n-form-item label="Description*">
    <n-input placeholder="Enter description" v-model:value="addForm.description"/>
  </n-form-item>
  <n-form-item label="Start Date*">
    <n-date-picker placeholder="Enter start date" v-model:value="addForm.startDate"/>
  </n-form-item>
  <n-form-item label="End Date*">
    <n-date-picker placeholder="" v-model:value="addForm.endDate"/>
  </n-form-item>
  <n-form-item label="Price*">
    <n-input-number  placeholder="Enter test price" v-model:value="addForm.price"/>
  </n-form-item>
</n-form>
<template #action>
      <n-space>
        <n-button @click="addModal = false">cancel</n-button>
      <n-button type="primary" :loading="loading" @click="addSubmit">submit</n-button>
      </n-space>
    </template>
        </n-modal>
        <n-modal v-model:show="editModal"
    :mask-closable="false"  preset="card"
    class="u-max-w-82"
    title="Add Test">
<n-form>
  <n-form-item label="Title*">
    <n-input placeholder="Enter test title" v-model:value="editForm.title"/>
  </n-form-item>
  <n-form-item label="Description*">
    <n-input placeholder="Enter description" v-model:value="editForm.description"/>
  </n-form-item>
  <n-form-item label="Start Date*">
    <n-date-picker placeholder="Enter start date" v-model:value="editForm.startDate"/>
  </n-form-item>
  <n-form-item label="End Date*">
    <n-date-picker placeholder="" v-model:value="editForm.endDate"/>
  </n-form-item>
  <n-form-item label="Price*">
    <n-input-number  placeholder="Enter test price" v-model:value="editForm.price"/>
  </n-form-item>
</n-form>
<template #action>
      <n-space>
        <n-button @click="editModal = false">cancel</n-button>
      <n-button type="primary" :loading="loading" @click="editSubmit">submit</n-button>
      </n-space>
    </template>
        </n-modal>
  </div>
    </div>
  </div>
</template>

<script setup>
import { NCard,NSkeleton,NButton,NDataTable,NP,NSpace,NModal,NForm,NInput,NFormItem,NDatePicker,NInputNumber,useMessage,useDialog} from 'naive-ui'
import { useTestStore } from '@/stores/test';
let loading = ref(false)
let addModal = ref(false)
let addForm = ref({
  startDate:Date.now(),endDate:Date.now(),description:'',title:'',price:0
})
let editModal = ref(false)
let editForm = ref({
  tId:null,startDate:Date.now(),endDate:Date.now(),description:'',title:'',price:0
})
let testStore = useTestStore()
let test = computed(()=>testStore.getTest)
let tests = computed(()=>{
  let res = testStore.getTests
  let data = res.map((test)=>({key:test.tId,title:test.title,start:test.startDate,end:test.endDate,price:test.price}))
  return data
})
let testsError = computed(()=>testStore.responseStatus)

async function fetchData(){
  loading.value = true
let testRes = await testStore.fetchTests()
loading.value = false
}
onMounted(async()=>{
    await fetchData()})
    definePageMeta({
  title:'test',
  middleware: "auth",
});
let selected = ref([])
let pagination = {pageSize: 1}
let columns = [{
        type: 'selection',
        options: [
          'all',
          'none']},
{
  title:'title',
  key:'title',
  sorter: true,
},{
  title:'start date',
  key:'start',
  sorter: true,
},{
  title:'end date',
  key:'end',
  sorter: true,
},{
  title:'price',
  key:'price',
  sorter: true,
}]
function handleSelect(data){
 selected.value=data
}

const message = useMessage();
const dialog = useDialog();
function notify(type,msg) {

        message['warning'](
          msg,
          {
            closable: true,
            duration: 3000
          }
        )
      }
async function addSubmit(){
  
  if(addForm.value.title!==''&&addForm.value.price!==''&&addForm.value.description!==''&&addForm.value.startDate!==0&&addForm.value.endDate!==0){
    loading.value = true
    let res = await testStore.addTest({
      title:addForm.value.title,
      startDate:new Date(addForm.value.startDate).toISOString(),
      endDate:new Date(addForm.value.endDate).toISOString(),
      description:addForm.value.description,
      price:addForm.value.price,
    })
    if(res == true){
      await fetchData()
      addModal.value = false
      addForm.value.title=''
      addForm.value.price=0
      addForm.value.description=''
      addForm.value.startDate=Date.now()
      addForm.value.endDate=Date.now()
    }else{
      notify('warning',testsError.msg)
    }
    loading.value = false
  }else{
notify('warning','please fill all the fields')
  }
}
async function confirmDelete(){
  
        dialog.warning({
          title: 'Confirm Delete',
          content: 'Are you sure?',
          positiveText: 'confirm',
          negativeText: 'cancel',
          onPositiveClick:()=> deleteTest(),
          onNegativeClick: () => {
            message.error('Delete cancelled')
          }
        })
}
async function deleteTest(){
  if(selected.value.length>0){
    loading.value = true
    let res  = await testStore.deleteTest(selected.value)
    if(res==true){
      message.info(`deleted ${selected.value}`)
      selected.value = []
      await fetchData()
    }else{
      message.info(`deleted ${selected.value}`)
    }
    loading.value = false
  }
}
async function handleEdit(){
  editModal.value = true
  let res = await testStore.fetchTest({tId:selected.value[0]})
  if(res == true){
  
    if(test.value){
      editForm.value.tId = test.value.tId
      editForm.value.title = test.value.title
      editForm.value.description = test.value.description
      editForm.value.startDate = Date.parse(test.value.startDate)
      editForm.value.endDate = Date.parse(test.value.endDate)
      editForm.value.price = test.value.price 
      editModal.value = true
    }
  }else{
    message.error('something went wrong')
  }
}
async function editSubmit(){
  
  if(editForm.value.title!==''&&editForm.value.price!==''&&editForm.value.description!==''&&editForm.value.startDate!==0&&editForm.value.endDate!==0){
    loading.value = true
    let res = await testStore.updateTest({
      tId:editForm.value.tId,
      title:editForm.value.title,
      startDate:new Date(editForm.value.startDate).toISOString(),
      endDate:new Date(editForm.value.endDate).toISOString(),
      description:editForm.value.description,
      price:editForm.value.price,
    })
    if(res == true){
      await fetchData()
     editModal.value = false
      editForm.value.title=''
      editForm.value.price=0
      editForm.value.description=''
      editForm.value.startDate=Date.now()
      editForm.value.endDate=Date.now()
    }else{
      notify('warning',testsError.msg)
    }
    loading.value = false
  }else{
notify('warning','please fill all the fields')
  }
}
function handleExam(){
  if(selected.value.length > 0){
    navigateTo(`test/${selected.value[0]}/exam`)
  }
}
</script>