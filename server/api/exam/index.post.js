import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
  
  
    if(event.context.auth.authenticated==true){
        let data =  await readBody(event)
        let supabase = serverSupabaseServiceRole(event)
        
        
        if(data){
            let last = await supabase.from('exam').select().eq('tId',data.tId).order('order', { ascending: false }).limit(1).single()

            let order = 1
            if(last.error == null && last.data){
                order = Math.round(last.data.order) + 1
            }
            let testRes = await supabase.from('exam').insert({...data,order:order}).select()
         
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