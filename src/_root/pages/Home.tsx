import Loader from '@/components/shared/Loader';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import React from 'react'

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
{/* If isPostLoading is true and there are no posts, show the loader.
    If not, display a list of posts

    Condition ? (Result if condition is met) : (Result if condition is not met)
 */}
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts?.documents.map((post: Models.Document) => (
                <li>{post.caption}</li>
              ))}
              TEST
            </ul>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default Home