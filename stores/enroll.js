import { defineStore } from "pinia"

export const useEnrollStore = defineStore('enroll', {
    state: () => ({
      enrolls:[],
      enroll:null,
      responseStatus:{
        error:false,
        msg:''
      }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      
      getEnrolls:(state)=>state.enrolls,
      getEnroll:(state)=>state.enroll,
      getResposnseStatus:(state)=>state.responseStatus

    },
    actions:{
        resetResponse(){
            this.responseStatus.error = false
            this.responseStatus.msg = ''
          },
          async fetchEnrolls(data){
    
            this.resetResponse()
            let res = await $fetch(`/api/enroll`,{
              params:data==true?{
                paid:true
              }:{}
            }).catch((err)=>err.response._data)
              
            if(res.error == null){
              this.enrolls = res.data
              return true
             
            }else{
              this.responseStatus.error = true
              this.responseStatus.msg = res.error.message
              return false
            }

          },
          async fetchEnroll(data){
            this.resetResponse()
            let res = await $fetch(`/api/enroll/${data.eId}`).catch((err)=>err.response._data)
              
            if(res.error == null){
              this.enroll = res.data
              return true
             
            }else{
              this.responseStatus.error = true
              this.responseStatus.msg = res.error.message
              return false
            }
          },
        async verifyPayment(data){
          this.resetResponse()
          let res = await $fetch(`/api/enroll/${data.eId}`,
          {method:"PUT",body:JSON.stringify({
            paid:true
          })}).catch((err)=>err.response._data)
            
          if(res.error == null){
            return true
          }else{
            this.responseStatus.error = true
            this.responseStatus.msg = res.error.message
            return false
          }
        }
      
    }
  })