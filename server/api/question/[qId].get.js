
import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let qId = event.context.params.qId
        let supabase = await serverSupabaseServiceRole(event)
        let question = await supabase.from('question').select().eq('qId',qId)
        if(question.error == null){
            
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                data:question.data[0],
                error:null
            }))
        }else{
            event.res.statusCode = 500
            return event.res.end(JSON.stringify({
                data:null,
                error:{message:question.error}
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