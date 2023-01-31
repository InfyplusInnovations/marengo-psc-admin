import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let eId = event.context.params.eId
       
        let supabase = await serverSupabaseServiceRole(event)
        if(eId){
            let enroll =  await supabase.from('enroll').select().eq('eId',eId).single()
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
            error:{message:'eId Not found'},
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