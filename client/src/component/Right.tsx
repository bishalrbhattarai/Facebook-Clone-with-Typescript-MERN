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
  Typography,
} from "@mui/material";

import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";
import CircleIcon from "@mui/icons-material/Circle";
const Right = () => {
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
        bgcolor={"grey"}
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
          <List
            sx={
              {
                //   border: "1px solid white",
              }
            }
          >
            <Box
              sx={{
                mx: "25px",
                // border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Online Contacts</Typography>

              <Box>
                <IconButton>
                  <SearchTwoToneIcon sx={{ color: "white" }} />
                </IconButton>
                <IconButton>
                  <MoreHorizTwoToneIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </Box>

            <ListItem
              sx={{ position: "relative" }}
              key={"rdjjvj"}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <IconButton>
                    <Avatar src="./pooja.jpg" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={"Pooja Basnet"} />
              </ListItemButton>

              <IconButton sx={{ position: "absolute", right: 268, top: 35 }}>
                {" "}
                <CircleIcon
                  sx={{ height: "10px", width: "10px", color: "green" }}
                />{" "}
              </IconButton>
            </ListItem>

            {[
              {
                name: "Bishal Raj Bhattarai",
              },
              {
                name: "Bijay Raj Bhattarai",
              },
              {
                name: "Anju Bhattarai",
              },
              { name: "Neesu KC Bhattarai" },

              { name: "Gopal Raj Bhattarai" },
            ].map((obj, index) => (
              <ListItem
                sx={{ position: "relative" }}
                key={index}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    <IconButton>
                      <Avatar> {obj.name.charAt(0)} </Avatar>
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText primary={obj.name} />
                </ListItemButton>

                <IconButton sx={{ position: "absolute", right: 268, top: 35 }}>
                  {" "}
                  <CircleIcon
                    sx={{ height: "10px", width: "10px", color: "green" }}
                  />{" "}
                </IconButton>
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

          <List sx={{}}>
            <Box
              sx={{
                mx: "25px",
                // border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Group Chats</Typography>

              <Box>
                <IconButton>
                  <SearchTwoToneIcon sx={{ color: "white" }} />
                </IconButton>
                <IconButton>
                  <MoreHorizTwoToneIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </Box>
            {[
              {
                name: "Football is My Drug",
              },
            ].map((obj, index) => (
              <ListItem
                sx={{ position: "relative" }}
                key={index}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    <IconButton>
                      <Avatar src="./barca.jpg" />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText primary={obj.name} />
                </ListItemButton>

                <IconButton sx={{ position: "absolute", right: 268, top: 35 }}>
                  <CircleIcon
                    sx={{ height: "10px", width: "10px", color: "green" }}
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Right;
