
import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let query  = await getQuery(event)
      if(query.exId){
        let supabase = await serverSupabaseServiceRole(event)
        let question = await supabase.from('question').select().eq('exId',query.exId)
        if(question.error == null){
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                data:question.data,
                error:null
            }))
        }else{
            event.res.statusCode = 400
            return event.res.end(JSON.stringify({
                data:null,
                error:{message:question.error}
            }))
        }
      }else{
        event.res.statusCode = 400
        return event.res.end(JSON.stringify({
            error:{message:'exam id not found'},
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