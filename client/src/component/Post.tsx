import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import { useAppSelector } from "../hooks/hook";
import CommentIcon from "@mui/icons-material/Comment";
import apiClient from "../http/apiClient";
// import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  caption: string;
  author: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
  likes: string[];
  images: string[];
  time: Date;
  comments: any[];
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  // const navigate = useNavigate();
  const [commentMessage, setCommentMessage] = useState<string>("");

  // Local state to handle comments
  const [comments, setComments] = useState(post.comments);

  const user = useAppSelector((state) => state.user.user);
  const [openModal, setOpenModal] = useState(false);
  const [likeValue, setLikeValue] = useState(post.likes);

  const toggleModal = () => setOpenModal(!openModal);

  const handleLike = async () => {
    try {
      const { data } = await apiClient.post("/post/like", {
        postId: post._id,
        userId: user?._id,
      });
      console.log(data);
      setLikeValue(data.value);
    } catch (error: any) {
      // If API call fails, revert the like count
      console.error("Failed to update like:", error);
      console.log(error.message);
      setLikeValue(post.likes);
    }
  };

  const handleComment = async (postId: string) => {
    try {
      const { data } = await apiClient.post("/post/add-comment", {
        userId: user?._id,
        postId,
        content: commentMessage,
      });
      if (data.success) {
        // Append the new comment to the local comments state
        setComments((prevComments) => [...prevComments, data.comment]);

        // Clear the input field after successful comment submission
        setCommentMessage("");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const renderImages = () => {
    const imageCount = post.images.length;
    const remainingCount = imageCount > 4 ? imageCount - 4 : 0;

    if (imageCount === 1) {
      return (
        <Box
          component="img"
          sx={{ width: "100%", height: "100%", cursor: "pointer" }}
          src={post.images[0]}
          onClick={toggleModal}
        />
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2px",
          position: "relative",
        }}
      >
        {post.images.slice(0, 4).map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            sx={{
              width: "100%",
              height: imageCount > 2 ? "150px" : "300px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={toggleModal}
          />
        ))}

        {remainingCount > 0 && (
          <Box
            onClick={toggleModal}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            +{remainingCount}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Card sx={{ backgroundColor: "#1c1c1d", color: "white", mb: 5, p: 2 }}>
      {/* Post Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Avatar src={post?.author.avatar} />
          <Box>
            <Typography>{`${post.author.firstName} ${post.author.lastName}`}</Typography>
            <Typography fontSize="10px">
              {new Date(post.time).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton>
            <MoreHorizTwoToneIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Post Caption */}
      <Box mb={2}>
        <Typography>{post.caption}</Typography>
      </Box>

      {/* Post Images */}
      <Box sx={{ position: "relative", mb: 2 }}>{renderImages()}</Box>

      {/* Likes and Comments Row */}
      <Box
        sx={{ color: "#AFAFA7" }}
        mt={0}
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <IconButton sx={{ color: "#AFAFA7" }}>
            <ThumbUpIcon
              sx={{
                backgroundColor: "blue",
                color: "#AFAFA7",
                borderRadius: "50px",
                border: "1px solid blue",
                height: "20px",
                width: "20px",
              }}
            />
            <FavoriteIcon
              sx={{
                backgroundColor: "red",
                color: "#AFAFA7",
                borderRadius: "50%",
                border: "1px solid red",
                height: "20px",
                width: "20px",
              }}
            />
          </IconButton>

          <Typography sx={{ fontWeight: "lighter" }}>
            {likeValue.length} likes
          </Typography>
        </Box>

        <Typography>{comments.length} comments</Typography>
      </Box>
      <Divider sx={{ border: "1px solid #333" }} />

      {/* Like and Comment Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          onClick={() => {
            handleLike();
          }}
        >
          <IconButton>
            <ThumbUpIcon
              sx={{
                color: likeValue.includes(user?._id!) ? "blue" : "#AFAFA7",
              }}
            />
          </IconButton>
          <Typography
            sx={{ color: likeValue.includes(user?._id!) ? "blue" : "#AFAFA7" }}
          >
            {likeValue.includes(user?._id!) ? "Liked" : "Like"}
          </Typography>
        </Box>

        <Box display="flex" color={"#AFAFA7"} alignItems="center">
          <IconButton>
            <CommentIcon sx={{ color: "#AFAFA7" }} />
          </IconButton>
          <Typography>Comment</Typography>
        </Box>
      </Box>

      <Divider sx={{ border: "0.1px solid #333" }} />

      {/* Comments Section */}
      <Box sx={{ maxHeight: "150px", overflowY: "auto", mt: 2 }}>
        {/* Input Field for New Comment */}
        <Box display="flex" gap={1} mb={2} alignItems="center">
          <Avatar src={user?.avatar} sx={{ width: 35, height: 35 }} />
          <TextField
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
            id="comment"
            name="comment"
            size="small"
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            sx={{
              bgcolor: "#333",
              borderRadius: "50px",
              input: { color: "white" },
              border: "none",
            }}
          />
          <IconButton onClick={() => handleComment(post._id)}>
            <SendIcon sx={{ color: "#AFAFA7" }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderWidth: "0.1px", border: "0.1px solid #333" }} />

        {/* Displaying Comments */}
        {comments.map((comment) => (
          <Box
            key={comment._id}
            sx={{ display: "flex", gap: 1, p: 1, alignItems: "center" }}
          >
            <Avatar
              src={comment.userId.avatar}
              sx={{ width: 35, height: 35 }}
            />
            <Typography
              sx={{
                p: 1,
                fontSize: "15px",
                bgcolor: "#333",
                borderRadius: "10px",
              }}
              variant="body2"
            >
              <strong style={{ fontSize: 12 }}>
                {`${comment.userId.firstName} ${comment.userId.lastName}`}

                <Typography
                  component="span"
                  sx={{ fontSize: "10px", color: "gray", ml: 1 }}
                >
                  {new Date(comment.time).toLocaleString()}
                </Typography>
              </strong>

              <Typography>{comment.content}</Typography>
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Modal for Image Gallery */}
      <Modal
        open={openModal}
        onClose={toggleModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "black",
            width: "100vw",
            height: "100vh",
            p: 2,
          }}
        >
          <IconButton
            onClick={toggleModal}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>

          {/* Modal Image Content */}
          <Box
            sx={{
              display: "flex",
              gap: "2px",
              width: "100%",
              height: "100%",
              flexWrap: "wrap",
              overflowY: "auto",
            }}
          >
            {post.images.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                sx={{ width: "50%", height: "50%" }}
              />
            ))}
          </Box>
        </Box>
      </Modal>
    </Card>
  );
};

export default Post;
