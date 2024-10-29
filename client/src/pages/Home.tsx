import { Box } from "@mui/material";
import Left from "../component/Left";
import Feed from "../component/Feed";
import Right from "../component/Right";

const Home = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#1c1e21",
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Left />
        <Feed />
        <Right />
      </Box>
    </>
  );
};

export default Home;
