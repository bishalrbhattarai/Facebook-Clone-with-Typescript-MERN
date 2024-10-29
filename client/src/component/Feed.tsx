import { Box, Typography } from "@mui/material";
import Post from "./Post";
import CreatePost from "./CreatePost";
import apiClient from "../http/apiClient";
import { useState, useEffect } from "react";

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const { data } = await apiClient.get("/post/posts");
      setPosts(data); // Store the fetched posts in the state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return posts.length > 0 ? (
    <Box mt={2} flex={2} px={5}>
      <CreatePost />
      {/* Map through posts and pass data to the Post component */}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Box>
  ) : (
    <>
      <Box sx={{ height: "87.9vh" }} mt={2} flex={2} px={5}>
        <CreatePost />
        <Typography
          sx={{ color: "white", fontSize: "30px" }}
          textAlign={"center"}
          mt={20}
        >
          No Posts to Show !!
        </Typography>
      </Box>
    </>
  );
};

export default Feed;
