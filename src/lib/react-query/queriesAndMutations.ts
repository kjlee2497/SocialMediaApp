import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createPost, createUserAccount, getRecentPosts, signInAccount, signOutAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    }) 
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { 
            email: string;
            password: string;
        }) => signInAccount(user)
    }) 
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    }) 
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
// instead of getting recent posts from our cache, we need to pull them again to get the most updated data
// that's why we need to use React queryClient to invalidate certain query keys
// we're pulling the queryKeys from an enum to help prevent/spot typos
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}