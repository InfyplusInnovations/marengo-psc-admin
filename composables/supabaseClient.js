export default async function(){
    let supabase = await useSupabaseClient()
    return supabase
}