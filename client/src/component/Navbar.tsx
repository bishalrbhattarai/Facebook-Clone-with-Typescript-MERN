import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  // IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HouseIcon from "@mui/icons-material/House";
import OndemandVideoSharpIcon from "@mui/icons-material/OndemandVideoSharp";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import SportsEsportsTwoToneIcon from "@mui/icons-material/SportsEsportsTwoTone";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../http/apiClient";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { removeUser } from "../redux/slices/userSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user);
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Close menu and search dropdown when clicking outside
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }

      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node) &&
        searchActive
      ) {
        setSearchActive(false);
      }
    },
    [menuOpen, searchActive]
  );

  const handleSearch = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchedTerm = e.target.value;
    setSearch(searchedTerm);

    try {
      const { data } = await apiClient.post("/user/search", {
        search: searchedTerm,
      });
      setUsers(data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Add/remove event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: 1 }}>
        <Toolbar
          sx={{
            zIndex: 1,
            bgcolor: "#1c1c1d",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              onClick={() => navigate("/")}
              style={{ width: "70px", height: "70px", cursor: "pointer" }}
              src={`${import.meta.env.VITE_PUBLIC_URL}/facebook.webp`}
              alt="logo"
            />
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <OutlinedInput
                value={search}
                onChange={handleSearch}
                sx={{
                  borderRadius: "20px",
                  bgcolor: "#2c2c2e",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                inputProps={{ style: { color: "white" } }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                }
                placeholder="Search Facebook"
                size="small"
                onFocus={() => setSearchActive(true)}
              />
              {searchActive && (
                <Box
                  ref={searchBoxRef}
                  sx={{
                    position: "absolute",
                    top: "77px",
                    left: "10px",
                    bgcolor: "#2c2c2e",
                    width: "340px",
                    color: "white",
                    p: 2,
                    borderRadius: "5px",
                  }}
                >
                  <Typography variant="body2">Search Results</Typography>
                  <Divider sx={{ bgcolor: "white", my: 1 }} />
                  <List>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <ListItem
                          onClick={() => {
                            // setSearchActive(false);
                            navigate(`/profile/${user._id}`);
                          }}
                          key={user?._id}
                          disablePadding
                        >
                          <ListItemButton>
                            <Avatar
                              alt={user.firstName}
                              src={user.avatar}
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body2">
                              {user.firstName} {user.lastName}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2">No results found</Typography>
                    )}
                  </List>
                </Box>
              )}
            </Box>
          </Box>

          {/* Main navigation buttons */}
          <Box
            sx={{
              display: { md: "flex", xs: "none" },
              gap: 1,
              color: "white",
              mr: 15,
            }}
          >
            <Button
              onClick={() => navigate("/")}
              sx={{
                px: 5,
                py: 3,
                color: "inherit",
                borderBottom:
                  location.pathname == "/"
                    ? "4px solid rgb(8, 102, 255)"
                    : null,
              }}
            >
              <HouseIcon />
            </Button>
            <Button sx={{ px: 5, py: 3, color: "inherit" }}>
              <OndemandVideoSharpIcon />
            </Button>
            <Button sx={{ px: 5, py: 3, color: "inherit" }}>
              <StorefrontIcon />
            </Button>
            <Button sx={{ px: 5, py: 3, color: "inherit" }}>
              <Groups2RoundedIcon
                sx={{ border: "1px solid white", borderRadius: "20px" }}
              />
            </Button>
            <Button sx={{ px: 5, py: 3, color: "inherit" }}>
              <SportsEsportsTwoToneIcon />
            </Button>
          </Box>

          {/* User menu and icons */}
          <Box display="flex" gap={1} alignItems="center">
            <MenuRoundedIcon fontSize="large" sx={iconStyles} />
            <MapsUgcIcon fontSize="large" sx={iconStyles} />
            <NotificationsIcon fontSize="large" sx={iconStyles} />
            <Box sx={{ position: "relative" }}>
              <Avatar
                onClick={() => setMenuOpen(!menuOpen)}
                // alt="User"
                src={user?.avatar}
                sx={{ width: 40, height: 40 }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dropdown menu */}
      {menuOpen && (
        <Box
          ref={menuRef}
          color="white"
          p={2}
          sx={{
            gap: 4,
            zIndex: 2,
            position: "absolute",
            top: 90,
            right: 15,
            backgroundColor: "#1c1c1d",
            height: "220px",
            width: "300px",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              // alt="User"
              src={user?.avatar}
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography fontWeight="bold">{`${user?.firstName} ${user?.lastName} `}</Typography>
              <Typography fontWeight="light" color="gray">
                See your profile
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, bgcolor: "white" }} />
          <Box mt={1} display="flex" flexDirection="column" gap={1}>
            <Box>
              <Button
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: "white",
                  fontWeight: "light",
                }}
              >
                <SettingsIcon sx={{ mr: 1 }} /> Settings
              </Button>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                  dispatch(removeUser());
                  navigate("/login");
                }}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  color: "white",
                  fontWeight: "light",
                }}
              >
                <LogoutSharpIcon sx={{ mr: 1 }} /> Logout
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

const iconStyles = {
  height: "40px",
  width: "40px",
  p: 1,
  border: "1px solid #2c2c2e",
  backgroundColor: "#2c2c2e",
  borderRadius: "20px",
};

export default Navbar;
