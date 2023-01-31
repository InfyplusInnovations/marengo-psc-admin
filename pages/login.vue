<template>
<div class="u-h-screen u-flex u-justify-center u-items-center">
       <div class="u-max-w-sm u-w-full">
         <n-card u-max-w-sm u-w-full>
             <div class="u-text-center u-p-3">
                 <img  src="/img/logo.svg"/>
             </div>
  <div class="">
    <n-form>
          <n-form-item-row label="Username*">
            <n-input v-model:value="loginForm.username" required  placeholder="Enter your email id"/>
          </n-form-item-row>
          <n-form-item-row label="Password*">
            <n-input  v-model:value="loginForm.password" type="password" 
      show-password-on="click"
      placeholder="Enter your Password" required/>
          </n-form-item-row>
        </n-form>
        <n-button :loading="loading" type="primary" block @click="login" >
          Sign In
        </n-button>
  </div>
  </n-card>
   </div>
</div>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import {NCard,NButton,NInput,NFormItemRow,NForm,NImage,useMessage,NAlert} from 'naive-ui'
let loginForm = ref({
    username:null,
    password:null
})

let loading = ref(false)

const router = useRouter()
const authStore = useAuthStore()
let responseStatus = computed(()=>authStore.getResponseStatus)
const message = useMessage();
function notify(type,msg) {

        message['warning'](
          msg,
          {
            closable: true,
            duration: 3000
          }
        )
      }
    
 async function login(){
  loading.value = true
  
  if(loginForm.value.username!==''&& loginForm.value.password!==''&&loginForm.value.username!==null&& loginForm.value.password!==null){
    let res =await  authStore.login({
    email:loginForm.value.username,
    password:loginForm.value.password
  })
 
  if(res == false){
    loading.value = false
   notify('warning',responseStatus.value.message)
  }
  if(res == true){
    
    let supabase = await useSupabaseClient()
    let {data}= await supabase.auth.getSession()

      if(data.session){
      
        if(!data.session.user.user_metadata.is_admin){
          notify('Unauthorized user')
          loading.value = false
        }else{
          const accessToken = useCookie('sb-access-token')
        const refreshToken = useCookie('sb-refresh-token')
        accessToken.value = data.session?.access_token ?? null
        refreshToken.value = data.session?.refresh_token ?? null
        }
        loading.value = false
    await navigateTo('/')
    }
   
    
  }
  }else{
    loading.value = false
    notify('warning','Please input all the required fields')
  }
}

definePageMeta({
  layout: "no-menu",
});
</script>
