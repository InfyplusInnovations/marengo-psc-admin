
import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let query  = await getQuery(event)
      if(query.tId){
        let supabase = await serverSupabaseServiceRole(event)
        let exam = await supabase.from('exam').select().eq('tId',query.tId)
        if(exam.error == null){
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                data:exam.data,
                error:null
            }))
        }else{
            event.res.statusCode = 400
            return event.res.end(JSON.stringify({
                data:null,
                error:{message:exam.error}
            }))
        }
      }else{
        event.res.statusCode = 400
        return event.res.end(JSON.stringify({
            error:{message:'test id not found'},
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