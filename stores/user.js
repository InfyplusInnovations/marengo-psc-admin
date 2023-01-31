import { defineStore } from "pinia"

export const useUserStore = defineStore('user', {
    state: () => ({
      users:[],
      user:null,
      responseStatus:{
        error:false,
        msg:''
      }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      
      getUsers:(state)=>state.users,
      getUser:(state)=>state.user,
      getResposnseStatus:(state)=>state.responseStatus

    },
    actions:{
        resetResponse(){
            this.responseStatus.error = false
            this.responseStatus.msg = ''
          },
          async fetchUser(data){
    
            this.resetResponse()
            let res = await $fetch(`/api/user/${data.uId}`).catch((err)=>err.response._data)
              
            if(res.error == null){
              this.user = res.data
              return true
             
            }else{
              this.responseStatus.error = true
              this.responseStatus.msg = res.error.message
              return false
            }

          }
        
      
    }
  })