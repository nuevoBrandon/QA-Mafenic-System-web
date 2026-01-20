const baseUrl = 'http://72.61.53.212:5000/api/v1'
export const environment ={
    base:baseUrl,
    auth:{
        base:'/auth',
        signIn:'/signIn',
        users:'/users',
        user:'/user',
        create:'/create',
        update:"/update",
        delete:"/delete"
    },
    ticket:{
        base:'/ticket',
        create:'/create',
        update:"/update"
    }
}