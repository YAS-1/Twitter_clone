import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {


	const getPostEndPoint = () => { // Setting conditions to access specific endpoints
		if(feedType == "forYou"){
			return "api/post/getAll"
		}
		if(feedType == "following"){
			return "api/post/followingPosts"
		}
		else{
			return "api/post/getAll"
		}
	}

	const POST_ENDPOINT = getPostEndPoint(); // Storing the selected endpoint

	const { data:posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey:["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok){throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
				
			}
		}
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;