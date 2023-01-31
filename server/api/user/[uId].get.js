import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let uId = event.context.params.uId
       
        let supabase = await serverSupabaseServiceRole(event)
        if(uId){
            let enroll =  await supabase.from('profile').select().eq('id',uId).single()
            if(enroll.error==null){
                event.res.statusCode = 200
                return event.res.end(JSON.stringify({
                    data:enroll.data,
                    error:null
                }))
            }else{
                event.res.statusCode = 400
                return event.res.end(JSON.stringify({
                    data:null,
                    error:{message:enroll.error}
                }))
            }
        }else{
            event.res.statusCode = 404
        return event.res.end(JSON.stringify({
            error:{message:'uId Not found'},
            data:null
        }))
        }
   
    }else{
        event.res.statusCode = 401
        return event.res.end(JSON.stringify({
            error:{message:'Please login to access data'},
            data:null
        }))
    }
})