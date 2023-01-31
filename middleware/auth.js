

export default defineNuxtRouteMiddleware(async(to, _from) => {
  let supabase = useSupabaseClient()
  let {data,error} = await supabase.auth.getSession()
  await supabase.auth.refreshSession()
  let user =await  useSupabaseUser()

  if(!user.value){
   
    if(!data.session||data.session==null||!data.session.user||!data.session.user.user_metadata.is_admin){
      return navigateTo('/login')
    }
    
 
  }else{
    if(!user.value.user_metadata.is_admin){
      
      return navigateTo('/login')

    }
  }

  })