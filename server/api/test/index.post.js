import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
  
  
    if(event.context.auth.authenticated==true){
        let data =  await readBody(event)
        let supabase = serverSupabaseServiceRole(event)
        if(data){
            let testRes = await supabase.from('tests').insert(data).select()
            if(testRes.error == null){
                event.res.statusCode = 201
                return event.res.end(JSON.stringify({
                    error:null,
                    data:testRes.data
                }))
            }else{
                event.res.statusCode = 400
                return event.res.end(JSON.stringify({
                    error:{message:testRes.error.message},
                    data:null
                }))
            }
           
        }else{
            event.res.statusCode = 400
            return event.res.end(JSON.stringify({
                error:{message:'missing data'},
                data:null
            }))
        }
        
    }else{
        event.res.statusCode = 401
        return event.res.end(JSON.stringify({
            error:{message:'Unauthorized user'},
            data:null
        }))
    }
})