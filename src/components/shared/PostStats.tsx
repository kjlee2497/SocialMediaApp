import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost  } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost  } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved  } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser();

    // check the currentUser's save record. If the record id matches the post id, it means it was previously saved by the user.
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => 
    record.post.$id === post.$id);

    useEffect(() => {
    // if there is a savedPostRecord, set isSaved to true.  If not, set it to false
    //  ALTERNATIVELY
    //  setIsSaved(savedPostRecord ? true : false)
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handeLikePost = (e: React.MouseEvent) => {
        // in the case we made the whole post clickable, we would need stopPropagation()
        // i.e. small button is inside large clickable object.  Makes it so that the click doesn't trigger the large object's event handler
        e.stopPropagation();

        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);

        // check if the current user's id is on the list
        // if true, filter through the array, clone everything except our userId (to unlike it)
        // if false, push our id into the newLikes array
        if(hasLiked) {
            newLikes = newLikes.filter((id) => id!== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes });
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if(savedPostRecord) {
            setIsSaved(false);
            // if the post has already been previously saved, delete the saved post and return.
            // ensures we don't hit the code below.
            // ALTERNATIVELY, add else statement and remove the return
            return deleteSavedPost(savedPostRecord.$id);
        }

        savePost({ postId: post.$id, userId });
        setIsSaved(true);
    }


  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img 
                src={checkIsLiked(likes, userId) ? 
                    "/assets/icons/liked.svg" :  "/assets/icons/like.svg"}
                alt="like"
                width={20}
                height={20}
                onClick={handeLikePost}
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
            {isSavingPost || isDeletingSaved ? <Loader /> :
            <img 
                src={isSaved ? 
                    "/assets/icons/saved.svg" :  "/assets/icons/save.svg"}            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
            />
            }
        </div>
    </div>
  )
}

export default PostStats