import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
  
 
    if(event.context.auth.authenticated==true){
        let supabase = await serverSupabaseServiceRole(event)
        let data =  await readBody(event)
        let tIds = data.tIds??[]
        if(tIds.length>0){
            let deleteRes = await supabase.from('tests').delete().in('tId',tIds).select()
            if(deleteRes.error == null){
                event.res.statusCode = 200
                return event.res.end(JSON.stringify({
                    error:null,
                    data:deleteRes.data
                }))
            }else{
                event.res.statusCode = 400
                return event.res.end(JSON.stringify({
                    error:{message:deleteRes.error.message},
                    data:null
                }))
            }
        }else{
            event.res.statusCode = 400
            return event.res.end(JSON.stringify({
                error:{message:'No test selected'},
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