<template>
    <div class="">
      <n-p>
        <n-button tertiary type="primary" @click="navigateTo('/test')">back to tests</n-button>
      </n-p>
      <div class="">
      <n-card class="" v-if="loading" title="Tests">
        <n-skeleton  text :repeat="6" />
      </n-card>
    <div class="" v-else>
      <div class="" v-if="examError.error == true">
         <n-card>
          Error :  {{examError.msg}}, Try refreshing page
         </n-card>
          </div>
          <div class=" u-flex u-gap-2 u-flex-col" v-else-if="exams.length>0">
           
          <n-card title="Exams">
            <n-p>
             <n-space> <n-button type="primary" @click="addModal=true">add</n-button>
              <n-button type="warning" :disabled="selected.length!==1" @click="handleEdit">edit</n-button>
             
              <n-button type="error" :disabled="selected.length<1" @click="confirmDelete">delete</n-button>
              <n-button type="info" :disabled="selected.length!==1" @click="handleQuestion">view questions</n-button></n-space>
              
            </n-p>
            <n-data-table :scroll-x="720"  :columns="columns" :data="exams"  v-model:checked-row-keys="selected" :pagination="pagination" :on-update:checked-row-keys="handleSelect"  flex-height class="u-min-h-80" remote/>
          </n-card>
              </div>
        
          <div class="" v-else>
             <n-card>
            <n-space>
              No exam available
              <n-button type="primary" @click="addModal=true">add</n-button>
            </n-space>
             </n-card>
          </div>
          <n-modal v-model:show="addModal"
      :mask-closable="false"  preset="card"
      class="u-max-w-82"
      title="Add Test">
  <n-form>
    <n-form-item label="Title*">
      <n-input placeholder="Enter exam title" v-model:value="addForm.title"/>
    </n-form-item>
    <n-form-item label="Description*">
      <n-input placeholder="Enter description" v-model:value="addForm.description"/>
    </n-form-item>
    <n-form-item label="Date*">
      <n-date-picker placeholder="Enter  date" v-model:value="addForm.date"/>
    </n-form-item>

    <n-form-item label="Time(minutes)*">
      <n-input-number  placeholder="Enter Exam time" v-model:value="addForm.time"/>
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
      <n-input placeholder="Enter exam title" v-model:value="editForm.title"/>
    </n-form-item>
    <n-form-item label="Description*">
      <n-input placeholder="Enter description" v-model:value="editForm.description"/>
    </n-form-item>
    <n-form-item label="Date*">
      <n-date-picker placeholder="Enter  date" v-model:value="editForm.date"/>
    </n-form-item>

    <n-form-item label="Time(minutes)*">
      <n-input-number  placeholder="Enter Exam time" v-model:value="editForm.time"/>
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
  import { useExamStore } from '@/stores/exam';
  let loading = ref(false)
  const route = useRoute()
  let addModal = ref(false)
  let addForm = ref({
    date:Date.now(),
    description:'',
    title:'',
    time:1
  })
  let editModal = ref(false)
  let editForm = ref({
    exId:null,date:Date.now(),
    description:'',
    title:'',
    time:1
  })
  let examStore = useExamStore()
  let exam = computed(()=>examStore.getExam)
  let exams = computed(()=>{
    let res = examStore.getExams
    let data = res.map((exam)=>({key:exam.exId,title:exam.title,date:exam.date,time:exam.time}))
    return data
  })
  let examError = computed(()=>examStore.responseStatus)
  
  async function fetchData(){
    loading.value = true
  let examRes = await examStore.fetchExams({tId:route.params.tId})
  loading.value = false
  }
  onMounted(async()=>{
      await fetchData()})
      definePageMeta({
    title:'exam',
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
    title:'date',
    key:'date',
    sorter: true,
  },{
    title:'time',
    key:'time',
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
    
    if(addForm.value.title!==''&&addForm.value.time!==''&&addForm.value.time>0&&addForm.value.description!==''&&addForm.value.date!==0){
      loading.value = true
      let res = await examStore.addExam({
        tId:route.params.tId,
        title:addForm.value.title,
        date:new Date(addForm.value.date).toISOString(),
        description:addForm.value.description,
        time:addForm.value.time,
      })
      if(res == true){
        await fetchData()
        addModal.value = false
        addForm.value.title=''
        addForm.value.time=1
        addForm.value.description=''
        addForm.value.date=Date.now()
      
      }else{
        notify('warning',examError.msg)
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
            onPositiveClick:()=> deleteExam(),
            onNegativeClick: () => {
              message.error('Delete cancelled')
            }
          })
  }
  async function deleteExam(){
    if(selected.value.length>0){
      loading.value = true
      let res  = await examStore.deleteExam(selected.value)
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
    let res = await examStore.fetchExam({exId:selected.value[0]})
    if(res == true){
    
      if(exam.value){
        editForm.value.exId = exam.value.exId
        editForm.value.title = exam.value.title
        editForm.value.description = exam.value.description
     
        editForm.value.date = Date.parse(exam.value.date)
        editForm.value.time = exam.value.time 
        editModal.value = true
      }
    }else{
      message.error('something went wrong')
    }
  }
  async function editSubmit(){
    
    if(editForm.value.title!==''&&editForm.value.time!==''&&editForm.value.time>0&&editForm.value.description!==''&&editForm.value.date!==0){
      loading.value = true
      let res = await examStore.updateExam({
        exId:editForm.value.exId,
        title:editForm.value.title,
        date:new Date(editForm.value.date).toISOString(),
        description:editForm.value.description,
        time:editForm.value.time,
      })
      if(res == true){
        await fetchData()
       editModal.value = false
        editForm.value.title=''
        editForm.value.time=1
        editForm.value.description=''
        editForm.value.date=Date.now()
      
      }else{
        notify('warning',testsError.msg)
      }
      loading.value = false
    }else{
  notify('warning','please fill all the fields')
    }
  }
  function handleQuestion(){
    if(selected.value.length > 0){
      navigateTo(`/test/${route.params.tId}/exam/${selected.value[0]}/question`)
    }
  }
  </script>