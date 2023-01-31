import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let eId = event.context.params.eId
        let data =  await readBody(event)
        
        let supabase = await serverSupabaseServiceRole(event)
        if(eId&&data){
            let enroll =  await supabase.from('enroll').update(data).eq('eId',eId).select()
           
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