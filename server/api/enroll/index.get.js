import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let query  = await getQuery(event)
        let supabase = await serverSupabaseServiceRole(event)
        let enroll = query.paid?await supabase.from('enroll').select().eq('paid',false): await supabase.from('enroll').select()
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