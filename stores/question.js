import { defineStore } from "pinia"

export const useQuestionStore = defineStore('question', {
    state: () => ({
     questions:[],
enrolled:[],
    question:null,
       responseStatus:{
      error:false,
      msg:''
    }
    }),
    getters: {
      // type is automatically inferred because we are not using `this`
      getQuestions: (state) => state.questions,
      getQuestion:(state)=>state.question,
      getResponseStatus:(state)=>state.responseStatus

    },
    actions:{
      resetResponse(){
        this.responseStatus.error = false
        this.responseStatus.message = ''
      },
      async fetchQuestions(data){
        this.resetResponse()
        let res = await $fetch(`/api/question`,{
          params:{
            exId:data.exId
          }
        }).catch((err)=>err.response._data)
          
        if(res.error == null){
          this.questions = res.data
         
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
        }
      },
      async fetchQuestion(data){
        this.resetResponse()
        
        let res = await $fetch(`/api/question/${data.qId}`).catch((err)=>err.response._data)
        
          if(res.error == null){

            this.question = res.data
            return true
     
          }else{
            this.responseStatus.error = true
            this.responseStatus.msg = res.error.message
            return false
          }
      },
      async addQuestion(data){
        this.resetResponse()
        let res = await $fetch(`/api/question`,{
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
      async deleteQuestion(data){
        this.resetResponse()
        let res = await $fetch(`/api/question`,{
          method:"DELETE",
          body:JSON.stringify({qIds:data})
        }).catch((err)=>err.response._data)
        if(res.error == null){
return true
        }else{
          this.responseStatus.error = true
          this.responseStatus.msg = res.error.message
          return false
        }
      },
      async updateQuestion(data){
        this.resetResponse()
        let res = await $fetch(`/api/question/${data.qId}`,{
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