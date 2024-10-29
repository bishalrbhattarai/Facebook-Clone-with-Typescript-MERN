import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch } from "../hooks/hook";
import { setUser } from "../redux/slices/userSlice";

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(3)
    .email("Please enter a valid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(3, "Password needs to be atleast 3 characters"),
});

type LoginInput = z.infer<typeof LoginSchema>;

const Login = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Snackbar error

  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const [showSnackbar, setShowSnackbar] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      LoginSchema.parse(input);
      console.log("yaha kasari pugyo");
      const { data } = await axios.post(
        "http://localhost:3000/auth/login",
        input,
        { withCredentials: true }
      );
      console.log(data);
      if (data.success) {
        dispatch(setUser(data.user));
        navigate("/");
      } else {
        setErrorMessage(data.message);
        setShowSnackbar(true);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors); // Store errors in state for UI
      } else {
        setErrorMessage(error.response.data.message);
        setShowSnackbar(true);
      }
    }
  };

  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            backgroundColor: "black", // Custom color for the background
            color: "#ffffff", // Custom text col
          }}
        >
          {errorMessage || "Something went wrong, please try again."}
        </Alert>
      </Snackbar>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          //  bgcolor: "grey",
          height: "90vh",
          width: "100vw",
        }}
      >
        <Box sx={{ border: "1px solid white" }}>
          <Grid container spacing={3}>
            <Grid sx={{}} size={{ xs: 12, md: 6 }}>
              <Box className="main-wrapper">
                <Box textAlign={"center"}>
                  <img
                    style={{ width: "65%", height: "65%" }}
                    src="./facebook.svg"
                    alt=""
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },

                      fontSize: {
                        xs: "0",
                        md: "28px",
                      },
                    }}
                  >
                    Connect with friends and the world around you on Facebook.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{}} size={{ xs: 12, md: 6 }}>
              <Box className="main-wrapper">
                <Box>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      p: 3,
                    }}
                  >
                    <TextField
                      onChange={handleChange}
                      name="email"
                      fullWidth
                      placeholder="Email"
                    ></TextField>
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {errors.email}
                    </span>
                    {/*  */}

                    <FormControl>
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        name="password"
                        onChange={handleChange}
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {errors.password}
                      </span>
                    </FormControl>

                    <Box>
                      <Button
                        onClick={handleSubmit}
                        sx={{ p: 2 }}
                        variant="contained"
                        fullWidth
                      >
                        {" "}
                        Log In
                      </Button>
                    </Box>
                    <Box textAlign={"center"}>
                      <Button>Forgot Password ?</Button>
                    </Box>

                    <Divider></Divider>
                    {/*    */}
                    <Box textAlign={"center"}>
                      <Button
                        onClick={() => navigate("/create-account")}
                        sx={{ bgcolor: "green", pX: 3, p: 2, color: "white" }}
                      >
                        Create New Account
                      </Button>
                    </Box>
                  </Card>
                  <Typography mt={1} textAlign={"center"}>
                    <b>Create a Page </b>
                    for a celebrity, brand or business.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default Login;
