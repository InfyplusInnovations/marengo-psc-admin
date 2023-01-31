
import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let exId = event.context.params.exId
        let supabase = await serverSupabaseServiceRole(event)
        let exam = await supabase.from('exam').select().eq('exId',exId)
        if(exam.error == null){
            
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                data:exam.data[0],
                error:null
            }))
        }else{
            event.res.statusCode = 500
            return event.res.end(JSON.stringify({
                data:null,
                error:{message:exam.error}
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