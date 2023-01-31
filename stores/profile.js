import { defineStore } from "pinia"

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile:null,
        responseStatus:{
            error:false,
            message:""
          },
    }),
    getters: {
        // type is automatically inferred because we are not using `this`
        getProfile: (state) => state.profile,
        getResposnseStatus:(state)=>state.responseStatus
  
      },
actions:{
    resetResponse(){
        this.responseStatus.error = false
        this.responseStatus.message = ''
      },
    async fetchProfile(){
        this.resetResponse()
        let supabase = await supabaseClient()
        let {data}= await supabase.auth.getSession()
        const res = await supabase
        .from('profile')
        .select("*")
        .eq('id', data.session.user.id)
        if(res && res.error==null){
            if(res.data.length>0){
                this.profile = res.data[0]
                return true
            }
            return false
        }else{
            return false
        }
    },
    async insertProfile(data){
        this.resetResponse()
        let supabase = await supabaseClient()
        
        const res = await supabase
        .from('profile').insert([data]).select()
      
        if(res && res.error==null){
            if(res.data.length>0){
                this.profile = res.data[0]
                return true
            }
            return false
        }else{
            return false
        }
    },
    async updateProfile(data){
        this.resetResponse()
        let supabase = await supabaseClient()
        
        const res = await supabase
        .from('profile').update([data]).eq('id', data.id).select()
      
        if(res && res.error==null){
            if(res.data.length>0){
                this.profile = res.data[0]
                return true
            }
            return false
        }else{
            return false
        }
    },
   
    
}
});