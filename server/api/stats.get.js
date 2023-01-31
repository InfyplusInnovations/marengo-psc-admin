import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
 
  
    if(event.context.auth.authenticated == true){
        
        let supabase = await serverSupabaseServiceRole(event)
        let test = await supabase.from('tests').select('*',{ count: 'exact', head: true })
        let enroll = await supabase.from('enroll').select('*',{ count: 'exact', head: true })
        if(test.error == null&&enroll.error==null){
           
            event.res.statusCode = 200
            return event.res.end(JSON.stringify({
                error:null,
                data:{
                    tests:test.count,
                    enroll:enroll.count
                }
            }))
        }else{
            event.res.statusCode = 500
            return event.res.end(JSON.stringify({
                error:{message:'something went wrong'},
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