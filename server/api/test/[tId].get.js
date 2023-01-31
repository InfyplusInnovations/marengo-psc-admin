
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        let tId = event.context.params.tId
        let supabase = await serverSupabaseClient(event)
        let test = await supabase.from('tests').select().eq('tId',tId)
        if(test.error == null){
            let resData = test.data[0]
            let enroll = await supabase.from('enroll').select().eq('tId',tId).eq('uId',event.context.auth.user.id)
            if(enroll.error==null&&enroll.data.length>0){
                
             
                    resData.enrolled=true
                    resData.paid = enroll.data[0].paid
                  
            }else{
                resData.paid=false
                resData.enrolled=false
            }
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                data:resData,
                error:null
            }))
        }else{
            event.res.statusCode = 500
            return event.res.end(JSON.stringify({
                data:null,
                error:{message:test.error}
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