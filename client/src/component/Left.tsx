import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PollSharpIcon from "@mui/icons-material/PollSharp";
import NewspaperSharpIcon from "@mui/icons-material/NewspaperSharp";
import Diversity3SharpIcon from "@mui/icons-material/Diversity3Sharp";
import StorefrontSharpIcon from "@mui/icons-material/StorefrontSharp";
import VideocamTwoToneIcon from "@mui/icons-material/VideocamTwoTone";
import { useAppSelector } from "../hooks/hook";
import { useNavigate } from "react-router-dom";
const Left = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const style = {
    //   borderRadius: "20px",
    //   border: "1px solid black",
    // color: "#1778F2",
    color: "white",
    height: "40px",
    width: "40px",
    mr: 1,
    ml: 1.5,
  };
  return (
    <>
      <Box
        sx={{
          bgcolor: "#1c1e21",
          color: "white",
          display: {
            lg: "block",
            xs: "none",
          },
        }}
        // bgcolor={"grey"}
        flex={1}
      >
        <Box
          sx={{
            position: "fixed",
            width: "340px",
            height: "calc(100vh - 72px)",
            overflow: "auto",
          }}
        >
          <List>
            <ListItem
              onClick={() => {
                navigate("/profile");
              }}
              key={"profile pic"}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <IconButton>
                    <Avatar sx={style} src={user?.avatar} />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={`${user?.firstName} ${user?.lastName}`}
                />
              </ListItemButton>
            </ListItem>

            {[
              {
                icon: <GroupIcon sx={style} />,
                name: "Friends (62 online)",
              },
              {
                name: "Professional Dashboard",
                icon: <PollSharpIcon sx={style} />,
              },
              { name: "Feeds", icon: <NewspaperSharpIcon sx={style} /> },
              { name: "Groups", icon: <Diversity3SharpIcon sx={style} /> },
              { name: "Marketplace", icon: <StorefrontSharpIcon sx={style} /> },
              { name: "Video", icon: <VideocamTwoToneIcon sx={style} /> },
            ].map((obj, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <IconButton>{obj.icon}</IconButton>
                  </ListItemIcon>
                  <ListItemText primary={obj.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider
            sx={{
              borderWidth: "0.1px",
              fontWeight: "light",
              border: "0.1px solid #333",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Left;
