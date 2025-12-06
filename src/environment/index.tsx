const baseUrl = 'http://localhost:5000/api/v1'
export const environment ={
    base:baseUrl,
    auth:{
        base:'/auth',
        signIn:'/signIn',
        users:'/users',
        create:'/create'
    },
    ticket:{
        base:'/ticket',
        create:'/create',
        update:"/update"
    }
}