import { serverSupabaseServiceRole } from '#supabase/server'
export default defineEventHandler(async(event) => {
  
  
    if(event.context.auth.authenticated==true){
        let data =  await readBody(event)
        let supabase = serverSupabaseServiceRole(event)
        
        console.log(data)
        if(data){
            let last = await supabase.from('question').select().eq('qId',data.qId).order('order', { ascending: false }).limit(1).single()

            let order = 1
            if(last.error == null && last.data){
                order = Math.round(last.data.order) + 1
            }
            let qRes = await supabase.from('question').insert({...data,order:order}).select()
            console.log(qRes)
            if(qRes.error == null){
                event.res.statusCode = 201
                return event.res.end(JSON.stringify({
                    error:null,
                    data:qRes.data
                }))
            }else{
                event.res.statusCode = 400
                return event.res.end(JSON.stringify({
                    error:{message:qRes.error.message},
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