const baseUrl = 'http://localhost:5000/api/v1'
export const environment ={
    base:baseUrl,
    auth:{
        base:'/auth',
        signIn:'/signIn',
        users:'/users',
        user:'/user',
        create:'/create',
        update:"/update"
    },
    ticket:{
        base:'/ticket',
        create:'/create',
        update:"/update"
    }
}