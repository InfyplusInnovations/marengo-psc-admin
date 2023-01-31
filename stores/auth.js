
import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', {
    state: () => ({
      responseStatus:{
        error:false,
        message:""
      },
    
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
  
      getResponseStatus:(state)=>state.responseStatus

    },
    actions:{
      resetResponse(){
        this.responseStatus.error = false
        this.responseStatus.message = ''
      },
       async login(data){
         this.resetResponse()
         let supabase = await supabaseClient()
          const res = await supabase.auth.signInWithPassword(data).catch((err)=>{
console.log(err)
          })
          console.log(res)
         if(res.error==null){
        
          return true
         }else{
          this.responseStatus.error = true
          this.responseStatus.message = res.error.message
          return false
         }
          },
          async signup(data){
            this.resetResponse()
            
            let supabase = await supabaseClient()
            const res = await supabase.auth.signUp(data).catch((err)=>console.log(err))
           
            if(res.error == null){
              
              if(res.data?.user?.identities?.length === 0){
                this.responseStatus.error = true
              this.responseStatus.message = "email already exists"
                return false
              }else{
                return true
              }
              
            }else{
              this.responseStatus.error = true
              this.responseStatus.message = res.error.message
              return false
            }
          },
          async resentEmail(data){
            let supabase = await supabaseClient()
            const res = await supabase.auth.signInWithOtp({...data,options:{
              shouldCreateUser:false
            }}).catch((err)=>console.log(err))
            if(res.error == null){
              return true
            }else{
              this.responseStatus.error = true
              this.responseStatus.message = res.error.message
              return false
            }
          },
          async resetPwd(data){
            let supabase = await supabaseClient()
            const res = await supabase.auth.resetPasswordForEmail(JSON.stringify(data)).catch((err)=>console.log(err))
            if(res.error == null){
              return true
            }else{
              this.responseStatus.error = true
              this.responseStatus.message = res.error.message
              return false
            }
          }
          // async refresh(){
          //   const res =  await $fetch("api/refresh",{
          //     method:'GET',
          //     headers: {
          //      'Accept': 'application/json',
          //      'Content-Type': 'application/json',
          //    }
          //   }).then((response)=>{
          //     console.log(response.status)
          //     if(response.status == 'success'){
          //      this.token = response.data.token
          //      this.isLoggedIn = true
          //      return true
          //     }else{
          //      this.token = null
          //      this.responseStatus.error = true
          //      this.responseStatus.message = response.message
          //      return false
          //     }
             
          //   }).catch((err)=>{
          //     console.log(err)
          //     this.responseStatus.error = true
          //      this.responseStatus.message = err.data.message
          //     return false
          //   })
          //    return res
          // }

      
    }
  })