
import { serverSupabaseUser } from '#supabase/server'
export default defineEventHandler(async(event) => {
    const clientSideRoutes = !event.req.url.startsWith('/api');
    if (clientSideRoutes) {
        return;
      }
    let user = await serverSupabaseUser(event)

    if(user==null){
            event.context.auth = {
                authenticated:false,
                user:null
            }
    }else{
       if(user.user_metadata&&user.user_metadata.is_admin==true){
        event.context.auth = {
            authenticated:true,
            user:user
        }
       }else{
        event.context.auth = {
            authenticated:false,
            user:null
        }
       }
    }
    
})