import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Modal,
  Typography,
  IconButton,
  TextField,
  CardMedia,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import apiClient from "../http/apiClient";
import { useAppSelector } from "../hooks/hook";

const CreatePostModal = () => {
  const user = useAppSelector((state) => state.user.user);
  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(""); // Snackbar error
  const [successMessage, setSuccessMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSnackbar2, setShowSnackbar2] = useState(false);

  // User Input
  const [images, setImages] = useState<File[] | any[]>([]);
  const [caption, setCaption] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle file uploads (multiple images)
  const handleImageUpload = (event: any) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  // Handle remove image
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!(caption.length > 0) && !(images.length > 0)) {
        setErrorMessage("Caption or Image Required ");
        setShowSnackbar(true);
        return;
      }

      const formData = new FormData();
      formData.append("caption", caption);
      images.forEach((image: File) => {
        formData.append("images", image);
      });

      setLoading(true); // Show loading overlay
      const { data } = await apiClient.post("/post/create-post", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleClose();
      setLoading(false); // Hide loading overlay
      console.log(data);
      if (data.success) {
        setSuccessMessage(data.message);
        setShowSnackbar2(true);

        window.location.reload();
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.response.data.message);
      setShowSnackbar(true);
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            backgroundColor: "black", // Custom color for the background
            color: "#ffffff", // Custom text color
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showSnackbar2}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar2(false)}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "green", // Custom color for the background
            color: "white", // Custom text color
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Card that opens the modal */}
      <Card
        sx={{
          mb: 5,
          p: 2,
          bgcolor: "#1c1c1d",
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar src={user?.avatar} />
          <TextField
            size="small"
            placeholder="What's on your mind Bishal?"
            fullWidth
            sx={{
              color: "white",
              borderRadius: "20px",
              bgcolor: "#2c2c2e",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            inputProps={{
              style: { color: "white" },
            }}
          />
        </Box>
        <Divider
          sx={{
            borderWidth: "0.1px",
            fontWeight: "light",
            border: "0.1px solid #333",
            my: 2,
          }}
        />
        <Box display="flex" justifyContent="space-around">
          <Button startIcon={<VideoCameraBackIcon />} sx={{ color: "red" }}>
            Video
          </Button>
          <Button startIcon={<AddPhotoAlternateIcon />} sx={{ color: "green" }}>
            Photo
          </Button>
        </Box>
      </Card>

      {/* Modal with multiple image upload */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1c1c1d",
            p: 4,
            borderRadius: 2,
            width: "500px",
            boxShadow: 24,
            color: "white",
          }}
        >
          {/* Modal Header */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Create Post</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          {/* Profile and Post Input */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={user?.avatar} alt="" />
            <Box>
              <Typography variant="body1">Bishal Raj Bhattarai</Typography>
              <Typography variant="caption">Friends</Typography>
            </Box>
          </Box>

          {/* Post Caption Input */}
          <Box mt={2}>
            <TextField
              placeholder="What's on your mind?"
              multiline
              name="caption"
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              rows={3}
              fullWidth
              sx={{
                bgcolor: "#2c2c2c",
                borderRadius: 1,
                input: { color: "white" },
                "& .MuiInputBase-root": {
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Image Upload Section */}
          <Box
            mt={2}
            p={2}
            sx={{
              border: "1px dashed grey",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography>Drag and drop or select images</Typography>
            <Button
              fullWidth
              sx={{
                bgcolor: "#2c2c2c",
              }}
              variant="contained"
              component="label"
            >
              Add Photos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </Box>

          {/* Display uploaded images */}
          {images.length > 0 && (
            <Box
              mt={2}
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
              }}
              display="flex"
              gap={2}
              flexWrap="wrap"
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                  }}
                >
                  <CardMedia
                    component="img"
                    src={URL.createObjectURL(image)}
                    alt="uploaded"
                    sx={{
                      borderRadius: "8px",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Post Button */}
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: "#1877F2" }}
          >
            Post
          </Button>

          {/* Loading overlay when posting */}
          {loading && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default CreatePostModal;
