import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { useState } from "react";
import apiClient from "../http/apiClient";
import { setUser } from "../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const user = useAppSelector((state) => state.user.user);

  // Separate states for avatar and cover
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [cover, setCover] = useState(user?.cover || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      setAvatarFile(file); // Store the selected avatar file
    }
  };

  const handleCoverChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCover(imageUrl);
      setCoverFile(file); // Store the selected cover file
    }
  };

  const handleUpdateAvatar = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const { data } = await apiClient.post("/user/updateAvatar", formData);
      if (data.success) {
        dispatch(setUser(data.user));
        setMessage(data.message);
        setOpenSnackbar(true);
      }
    } catch (error: any) {
      setMessage(error.response?.data.message || "An error occurred");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setAvatarFile(null); // Reset avatar file
    }
  };

  const handleUpdateCover = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (coverFile) {
        formData.append("cover", coverFile); // Append cover file
      }
      const { data } = await apiClient.post("/user/updateCover", formData);
      if (data.success) {
        dispatch(setUser(data.user));
        setMessage(data.message);
        setOpenSnackbar(true);
      }
    } catch (error: any) {
      setMessage(error.response?.data.message || "An error occurred");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setCoverFile(null); // Reset cover file
    }
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    event;
    if (reason === "clickaway") {
      setOpenSnackbar(false);
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#1c1e21",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "470px",
            width: "75%",
            objectFit: "cover",
            borderRadius: "10px",
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Button
          startIcon={<CameraAltIcon />}
          sx={{
            px: 2,
            textTransform: "capitalize",
            color: "black",
            bgcolor: "white",
            position: "absolute",
            bottom: 220,
            right: 250,
          }}
          component="label"
        >
          Edit Cover Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleCoverChange}
          />
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              color: "white",
              display: "flex",
              gap: 3,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={avatar}
                sx={{
                  border: "4px solid grey",
                  height: "188px",
                  width: "188px",
                  position: "relative",
                  bottom: 25,
                }}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  sx={{
                    bgcolor: "#1c1e21",
                    position: "absolute",
                    bottom: 35,
                    left: 140,
                  }}
                >
                  <CameraAltIcon
                    sx={{ color: "white", height: "25px", width: "25px" }}
                  />
                </IconButton>
              </label>
            </Box>
            <Box>
              <Typography fontSize={35}>Bishal Raj Bhattarai</Typography>
              <Typography>{user?.friends.length} Friends</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Button startIcon={<AssessmentIcon />} variant="contained">
              See Dashboard
            </Button>
            <Button
              startIcon={<AssessmentIcon />}
              variant="contained"
              sx={{ bgcolor: "grey" }}
            >
              Edit
            </Button>
            <Button
              startIcon={<CellTowerIcon />}
              variant="contained"
              sx={{ bgcolor: "grey" }}
            >
              Advertise
            </Button>
          </Box>
        </Box>

        {/* Render buttons conditionally based on selected files */}
        {avatarFile && (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateAvatar}
            sx={{
              bgcolor: "grey",
              mt: 2,
              px: 5,
              borderRadius: "20px",
              position: "absolute",
              top: 620,
              left: 150,
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile Picture"
            )}
          </Button>
        )}
        {coverFile && (
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateCover}
            sx={{
              bgcolor: "green",
              mt: 2,
              px: 5,
              borderRadius: "20px",
              position: "absolute",
              top: 470,
              right: 200,
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Cover Photo"
            )}
          </Button>
        )}
      </Box>
      <Divider sx={{ border: "1px solid #333" }} />

      <Box
        display="flex"
        bgcolor="#1c1e21"
        sx={{ justifyContent: "center", gap: 2, color: "white" }}
      >
        <Box>
          <Button sx={{ color: "white" }}>Posts</Button>
          <Button sx={{ color: "white" }}>About</Button>
          <Button sx={{ color: "white" }}>Friends</Button>
          <Button sx={{ color: "white" }}>Photos</Button>
          <Button sx={{ color: "white" }}>Videos</Button>
          {/* <Button sx={{ color: "white" }}>More</Button> */}
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
