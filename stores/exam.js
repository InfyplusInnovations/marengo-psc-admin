import { defineStore } from "pinia"

export const useExamStore = defineStore('exam', {
    state: () => ({
     exams:[],
enrolled:[],
    exam:null,
       responseStatus:{
      error:false,
      msg:''
    }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      getExams: (state) => state.exams,
      getExam:(state)=>state.exam,
      getResponseStatus:(state)=>state.responseStatus

    },
    actions:{
      resetResponse(){
        this.responseStatus.error = false
        this.responseStatus.message = ''
      },
      async fetchExams(data){
        this.resetResponse()
        let res = await $fetch(`/api/exam`,{
          params:{
            tId:data.tId
          }
        }).catch((err)=>err.response._data)
          
        if(res.error == null){
          this.exams = res.data
         
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
        }
      },
      async fetchExam(data){
        this.resetResponse()
        
        let res = await $fetch(`/api/exam/${data.exId}`).catch((err)=>err.response._data)
        
          if(res.error == null){

            this.exam = res.data
            return true
     
          }else{
            this.responseStatus.error = true
            this.responseStatus.msg = res.error.message
            return false
          }
      },
      async addExam(data){
        this.resetResponse()
        let res = await $fetch(`/api/exam`,{
          method:"POST",
          body:JSON.stringify(data)
        }).catch((err)=>err.response._data)
        if(res.error == null){
          return true
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
          return false
        }
      },
      async deleteExam(data){
        this.resetResponse()
        let res = await $fetch(`/api/exam`,{
          method:"DELETE",
          body:JSON.stringify({exIds:data})
        }).catch((err)=>err.response._data)
        if(res.error == null){
return true
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
          return false
        }
      },
      async updateExam(data){
        this.resetResponse()
        let res = await $fetch(`/api/exam/${data.exId}`,{
          method:"PUT",
          body:JSON.stringify(data)
        }).catch((err)=>console.log)
        if(res.error == null){
          return true
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
          return false
        }
      },
    }
  })