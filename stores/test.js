import { defineStore } from "pinia"

export const useTestStore = defineStore('test', {
    state: () => ({
     tests:[],
enrolled:[],
    test:null,
       responseStatus:{
      error:false,
      msg:''
    }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      getTests: (state) => state.tests,
      getTest:(state)=>state.test,
      getResponseStatus:(state)=>state.responseStatus

    },
    actions:{
      resetResponse(){
        this.responseStatus.error = false
        this.responseStatus.message = ''
      },
      async fetchTests(data){
        this.resetResponse()
        let res = await $fetch('/api/test').catch((err)=>{
          console.log(err)})
        if(res.error == null){
          this.tests = res.data.tests
          this.enrolled = res.data.enrolled
        }else{
          this.responseStatus.error = false
          this.responseStatus.msg = res.error.message
        }
      },
      async fetchTest(data){
        this.resetResponse()
        console.log(data)
        let res = await $fetch(`/api/test/${data.tId}`).catch((err)=>{
          console.log(err)})
        
          if(res.error == null){

            this.test = res.data
            return true
     
          }else{
            this.responseStatus.error = false
            this.responseStatus.msg = res.error.message
            return false
          }
      },
      async addTest(data){
        this.resetResponse()
        let res = await $fetch(`/api/test`,{
          method:"POST",
          body:JSON.stringify(data)
        }).catch((err)=>console.log)
        if(res.error == null){
          return true
        }else{
          this.responseStatus.error = false
          this.responseStatus.msg = res.error.message
          return false
        }
      },
      async deleteTest(data){
        this.resetResponse()
        let res = await $fetch(`/api/test`,{
          method:"DELETE",
          body:JSON.stringify({tIds:data})
        }).catch((err)=>console.log)
        if(res.error == null){
return true
        }else{
          this.responseStatus.error = false
          this.responseStatus.msg = res.error.message
          return false
        }
      },
      async updateTest(data){
        this.resetResponse()
        let res = await $fetch(`/api/test/${data.tId}`,{
          method:"PUT",
          body:JSON.stringify(data)
        }).catch((err)=>console.log)
        if(res.error == null){
          return true
        }else{
          this.responseStatus.error = false
          this.responseStatus.msg = res.error.message
          return false
        }
      },
    }
  })