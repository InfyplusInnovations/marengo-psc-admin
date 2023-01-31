import { defineStore } from "pinia"

export const useStatsStore = defineStore('stats', {
    state: () => ({
      stats:null,
   
      responseStatus:{
        error:false,
        msg:''
      }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      
      getStats:(state)=>state.stats,
     
      getResposnseStatus:(state)=>state.responseStatus

    },
    actions:{
        resetResponse(){
            this.responseStatus.error = false
            this.responseStatus.msg = ''
          },
          async fetchStats(){
    
            this.resetResponse()
            let res = await $fetch(`/api/stats`).catch((err)=>err.response._data)
              
            if(res.error == null){
              this.stats = res.data
              return true
             
            }else{
              this.responseStatus.error = true
              this.responseStatus.msg = res.error.message
              return false
            }

          },
         
      
    }
  })