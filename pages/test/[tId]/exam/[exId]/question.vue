<template>
      <n-p>
        <n-button tertiary type="primary" @click="navigateTo(`/test/${$route.params.tId}/exam`)">back to exams</n-button>
      </n-p>
      <div class="">
      <n-card class="" v-if="loading" title="Questions">
        <n-skeleton  text :repeat="6" />
      </n-card>
    <div class="" v-else>
      <div class="" v-if="questionError.error == true">
         <n-card>
          Error :  {{questionError.msg}}, Try refreshing page
         </n-card>
          </div>
          <div class=" u-flex u-gap-2 u-flex-col" v-else-if="questions.length>0">
           
          <n-card title="Questions">
            <n-p>
             <n-space> <n-button type="primary" @click="addModal=true">add</n-button>
              <n-button type="warning" :disabled="selected.length!==1" @click="handleEdit">edit</n-button>
             
              <n-button type="error" :disabled="selected.length<1" @click="confirmDelete">delete</n-button>
             </n-space>
              
            </n-p>
            <n-data-table  :scroll-x="400"  :columns="columns" :data="questions"  v-model:checked-row-keys="selected" :pagination="pagination" :on-update:checked-row-keys="handleSelect"  flex-height class="u-min-h-80" remote/>
          </n-card>
              </div>
        
          <div class="" v-else>
             <n-card>
            <n-space>
              No Questions available
              <n-button type="primary" @click="addModal=true">add</n-button>
            </n-space>
             </n-card>
          </div>
          <n-modal v-model:show="addModal"
      :mask-closable="false"  preset="card"
      class="u-max-w-82"
      title="Add Question">
  <n-form>
    <n-form-item label="Question*">
      <n-input placeholder="Enter Question" v-model:value="addForm.question" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option A*">
      <n-input placeholder="Enter answer 1" v-model:value="addForm.option1" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option B*">
      <n-input placeholder="Enter answer 2" v-model:value="addForm.option2" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option C*">
      <n-input placeholder="Enter answer 3" v-model:value="addForm.option3" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option D*">
      <n-input placeholder="Enter Answer 4" v-model:value="addForm.option4" type="textarea"/>
    </n-form-item>
    <n-form-item label="Answer*">
      <n-select placeholder="Enter Answer 4" v-model:value="addForm.answer" :options="[{label:'A',value:1},{label:'B',value:2},{label:'C',value:3},{label:'D',value:4}]"/>
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
      title="Edit Question">
      <n-form>
    <n-form-item label="Question*">
      <n-input placeholder="Enter Question" v-model:value="editForm.question" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option A*">
      <n-input placeholder="Enter answer 1" v-model:value="editForm.option1" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option B*">
      <n-input placeholder="Enter answer 2" v-model:value="editForm.option2" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option C*">
      <n-input placeholder="Enter answer 3" v-model:value="editForm.option3" type="textarea"/>
    </n-form-item>
    <n-form-item label="Option D*">
      <n-input placeholder="Enter Answer 4" v-model:value="editForm.option4" type="textarea"/>
    </n-form-item>
    <n-form-item label="Answer*">
      <n-select placeholder="Enter Answer 4" v-model:value="editForm.answer" :options="[{label:'A',value:1},{label:'B',value:2},{label:'C',value:3},{label:'D',value:4}]"/>
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
</template>
<script setup>
import { NCard,NSkeleton,NButton,NDataTable,NP,NSpace,NModal,NForm,NInput,NFormItem,NSelect,useMessage,useDialog} from 'naive-ui'
  import { useQuestionStore } from '@/stores/question';
  let loading = ref(false)
  const route = useRoute()
  let addModal = ref(false)
  let addForm = ref({
  question:'',
  option1:'',
  option2:'',
  option3:'',
  option4:'',
  answer:null
  })
  let editModal = ref(false)
  let editForm = ref({
  qId:null,
  question:'',
  option1:'',
  option2:'',
  option3:'',
  option4:'',
  answer:null
  })
  let qStore = useQuestionStore()
  let question = computed(()=>qStore.getQuestion)
  let questions = computed(()=>{
    let res = qStore.getQuestions
    let data = res.map((question,index)=>({key:question.qId,question:question.question.substr(0,20)}))
    return data
  })
  let questionError = computed(()=>qStore.responseStatus)
  
  async function fetchData(){
    loading.value = true
  let qRes = await qStore.fetchQuestions({exId:route.params.exId})
  loading.value = false
  }
  onMounted(async()=>{
      await fetchData()})
      definePageMeta({
    title:'questions',
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
    title:'question',
    key:'question',
    sorter: true,
  },
]
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
    
    if(addForm.value.question!==''&&addForm.value.option1!==''&&addForm.value.option2!==''&&addForm.value.option3!==''&&addForm.value.option4!==''&&addForm.value.answer!==null){
      loading.value = true
      let res = await qStore.addQuestion({
        exId : route.params.exId,
        question:addForm.value.question,
        option1:addForm.value.option1,
        option2:addForm.value.option2,
        option3:addForm.value.option3,
        option4:addForm.value.option4,
        answer:addForm.value.answer
      })
      if(res == true){
        await fetchData()
        addForm.value.qId= null
       addForm.value.question=''
       addForm.value.option1=''
       addForm.value.option2=''
       addForm.value.option3=''
       addForm.value.option4=''
       addForm.value.answer = null
     addModal.value = false
      
      }else{
        notify('warning',questionError.msg)
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
            onPositiveClick:()=> deleteQuestion(),
            onNegativeClick: () => {
              message.error('Delete cancelled')
            }
          })
  }
  async function deleteQuestion(){
    if(selected.value.length>0){
      loading.value = true
      let res  = await qStore.deleteQuestion(selected.value)
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
    let res = await qStore.fetchQuestion({qId:selected.value[0]})
    if(res == true){
    
      if(question.value){
        editForm.value.qId = question.value.qId
        editForm.value.question = question.value.question
        editForm.value.option1 = question.value.option1
        editForm.value.option2 = question.value.option2
        editForm.value.option3 = question.value.option3
        editForm.value.option4 = question.value.option4
        editForm.value.answer = question.value.answer
        editModal.value = true
      }
    }else{
      message.error('something went wrong')
    }
  }
  async function editSubmit(){

    if(editForm.value.qId!==''&&editForm.value.question!==''&&editForm.value.option1!==''&&editForm.value.option2!==''&&editForm.value.option3!==''&&editForm.value.option4!==''&&editForm.value.answer!==''){
      loading.value = true
      let res = await qStore.updateQuestion({
        qId:editForm.value.qId,
        question:editForm.value.question,
        option1:editForm.value.option1,
        option2:editForm.value.option2,
        option3:editForm.value.option3,
        option4:editForm.value.option4,
        answer:editForm.value.answer
      })
      if(res == true){
        await fetchData()
        editForm.value.qId= null
       editForm.value.question=''
       editForm.value.option1=''
       editForm.value.option2=''
       editForm.value.option3=''
       editForm.value.option4=''
       editForm.value.answer = null
       editModal.value = false    
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