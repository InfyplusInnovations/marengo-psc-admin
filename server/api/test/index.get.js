import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async(event) => {
 

    let supabase = await serverSupabaseClient(event)
    let tests = await supabase.from('tests').select().gte('endDate',new Date(Date.now()).toISOString())
    if(tests.error == null){
        let resData = tests.data
        let enrolled = []
        if(event.context.auth.authenticated == true){
            let enrolls = await supabase.from('enroll').select('*').eq('uId',event.context.auth.user.id)
            if(enrolls.error == null&&enrolls.data&&enrolls.data.length>0){
                resData.forEach((test,index)=>{
                    resData[index].paid = false
                    resData[index].enrolled = false
                    enrolls.data.forEach((enroll)=>{
                        
                        if(enroll.tId == test.tId){
                            resData[index].enrolled = true
                            resData[index].paid=enroll.paid
                            enrolled.push(resData[index])
                        }
                    })
                })
            }
        }
        event.res.statusCode = 200
        return event.res.end(JSON.stringify({
            error:null,
            data:{
                tests:resData,
                enrolled:enrolled
            }
        }))
    }else{
        event.res.statusCode = 404
        return event.res.end(JSON.stringify({
            data:null,
            error:{message:tests.error}
        }))
    }
//     if(event.context.auth.authenticated){
//         let uId = event.context.auth.user.id
//         let enrolls = await supabase
//         .from('enroll')
//         .select("*")
//         .eq('uId', uId)
//        let tests = await supabase.from('tests').select().gte('endDate',Date.now())
//    if(tests.error == null){
    
//     if(enrolls.data&&enrolls.data.length>0&&tests.data){
//         tests.data.forEach((test)=>{
//             enrolls.data.forEach(enroll=>{
//                 console.log(enroll)
//             })
//         })
//        }else{

//        }
//    }else{
//         event.res.statusCode = 404
//         return event.res.end(JSON.stringify({
//             status:"error",
//             message:tests.error
//         }))
//     }

//     }else{
//         let tests = await supabase.from('tests').select().gte('endDate',Date.now())
//         if(tests.error == null){
//             event.res.statusCode = 200
//             return event.res.end(JSON.stringify({
//                 status:"success",
//                 data:tests.data
//             }))
//         }else{
            
//         event.res.statusCode = 404
//         return event.res.end(JSON.stringify({
//             status:"error",
//             message:tests.error
//         }))
            
//         }
       
//     }
    // const {data,error} = await supabase.from('tests').select()
   
    // if(error == null){
    //     if(event.context.auth.authenticated == true){
          

       
    //     let resData = data ?? []
    //     if(enrolls.data && enrolls.data.length>0){
            
    //     }
    //     }
    //     event.res.statusCode = 200
    //     return event.res.end(JSON.stringify({
    //         status:"success",
    //         data:data
    //     }))
    // }else{
    //     event.res.statusCode = 404
    //     return event.res.end(JSON.stringify({
    //         status:"error",
    //         message:error
    //     }))
    // }
})