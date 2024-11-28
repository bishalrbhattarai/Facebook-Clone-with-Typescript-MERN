import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CellTowerIcon from "@mui/icons-material/CellTower";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks/hook";
import { useState, useEffect } from "react";
import apiClient from "../http/apiClient";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SmsIcon from "@mui/icons-material/Sms";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
const button = { color: "white" };

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const loggedInUser = useAppSelector((state) => state.user.user);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.post("/user", { id });
      setUser(data.user);
      setIsFriend(data.user.friends.includes(loggedInUser?._id));
      setIsPending(data.user.pendingFriends.includes(loggedInUser?._id));
      setIsRequested(data.user.friendRequests.includes(loggedInUser?._id));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const handleAddFriend = async () => {
    try {
      // return;
      await apiClient.post("/user/add-friend", { id });
      fetchUserProfile();
      // setIsRequested(true); // Update UI to show request sent
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await apiClient.post("/user/remove-friend", { friendId: id });
      fetchUserProfile(); // Update UI to reflect removal
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

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
            objectPosition: "center",
            objectFit: "cover",
            borderRadius: "10px",
          }}
          src={user.cover}
          component={"img"}
        />

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
            <Avatar
              src={user.avatar}
              sx={{
                border: "4px solid grey",
                height: "188px",
                width: "188px",
                position: "relative",
                bottom: 25,
              }}
            />
            <Box>
              <Typography
                fontSize={35}
              >{`${user.firstName} ${user.lastName}`}</Typography>
              <Typography>{user.friends.length} Friends</Typography>
              <Box display="flex">
                {user.friends.slice(0, 4).map((friend: any, index: number) => (
                  <Avatar key={index} sx={{ height: "30px", width: "30px" }}>
                    {friend[0]}
                  </Avatar>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            {isFriend ? (
              <>
                <Button variant="contained" sx={{ bgcolor: "grey" }}>
                  Friends
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRemoveFriend}
                >
                  Remove Friend
                </Button>
              </>
            ) : isPending ? (
              <>
                <Button variant="contained" color="success">
                  Confirm Request
                </Button>

                <Button variant="contained" color="error">
                  Reject Request
                </Button>
              </>
            ) : isRequested ? (
              <Button
                startIcon={<PersonRemoveAlt1RoundedIcon />}
                variant="contained"
                color="primary"
              >
                Cancel Request
              </Button>
            ) : (
              <Button
                startIcon={<PersonAddIcon />}
                variant="contained"
                // sx={{ bgcolor: "#2c2c2e" }}
                color="success"
                onClick={handleAddFriend}
              >
                Add Friend
              </Button>
            )}
            <Button startIcon={<SmsIcon />} variant="contained">
              Message
            </Button>
            <Button
              startIcon={<CellTowerIcon />}
              variant="contained"
              sx={{ bgcolor: "grey", visibility: "hidden" }}
            >
              Advertise
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ border: "1px solid #333" }} />

      <Box
        display="flex"
        bgcolor="#1c1e21"
        sx={{ justifyContent: "center", gap: 2, color: "white" }}
      >
        <Box>
          <Button sx={button}>Posts</Button>
          <Button sx={button}>About</Button>
          <Button sx={button}>Photos</Button>
          <Button sx={button}>
            <MoreHorizIcon />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
