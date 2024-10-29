import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";

interface Input {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "";
}

const SignUpSchema = z.object({
  firstName: z
    .string({
      required_error: "First Name is Required for SIGN UP",
    })
    .min(3, "First Name must contain at least 3 characters"),
  lastName: z
    .string({
      required_error: "Last Name is Required ",
    })
    .min(3, "Last Name must contain at least 3 characters"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select gender",
  }),
  email: z
    .string({
      required_error: "Email is Required ",
    })
    .min(3)
    .email("Enter valid email"),
  password: z
    .string({
      required_error: "Password is Required ",
    })
    .min(3, "Password must contain at least 3 characters"),
});

const CreateAccount = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Snackbar error
  const [input, setInput] = useState<Input>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      SignUpSchema.parse(input);
      const { data } = await axios.post(
        "http://localhost:3000/auth/signup",
        input
      );
      if (data.success) {
        navigate("/login");
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
        sx={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Card
          sx={{
            border: "1px solid white",
            width: "30vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box textAlign={"center"}>
            <img
              style={{ height: "85%", width: "80%" }}
              src="./facebook.svg"
              alt=""
            />
          </Box>
          <Box textAlign={"center"}>
            <Typography fontSize={"28px"} fontWeight={"bold"}>
              Create a new account
            </Typography>
            <Typography fontWeight="light">It's quick and easy</Typography>
          </Box>

          <Box
            mt={2}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box display="flex" flexDirection="column">
                <TextField
                  onFocus={() => {
                    setErrors({
                      ...errors,
                      firstName: "",
                    });
                  }}
                  onChange={handleChange}
                  name="firstName"
                  placeholder={"First Name"}
                  size="small"
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.firstName}
                </span>
              </Box>

              <Box display="flex" flexDirection="column">
                <TextField
                  onFocus={() => {
                    setErrors({
                      ...errors,
                      lastName: "",
                    });
                  }}
                  name="lastName"
                  onChange={handleChange}
                  placeholder={"Last Name"}
                  size="small"
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.lastName}
                </span>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ display: "flex", textAlign: "center" }}>
                Gender :{" "}
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: 3,
                    color: "red",
                  }}
                >
                  {errors.gender ? "Please select a gender" : null}
                </span>
              </Typography>
            </Box>

            <Box>
              <FormControl sx={{ display: "flex", gap: 4 }}>
                <RadioGroup
                  onFocus={() => {
                    setErrors({
                      ...errors,
                      gender: "",
                    });
                  }}
                  onChange={handleChange}
                  row
                  name="gender"
                >
                  <FormControlLabel
                    sx={{ flex: 1 }}
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    sx={{ flex: 1 }}
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          <Divider />
          <Box
            sx={{
              p: 1,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box>
              <TextField
                onFocus={() => {
                  setErrors({
                    ...errors,
                    email: "",
                  });
                }}
                value={input.email}
                onChange={handleChange}
                name="email"
                placeholder="Email"
                fullWidth
                size="small"
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.email}
              </span>
            </Box>

            <Box>
              <TextField
                name="password"
                type="password"
                onFocus={() => {
                  setErrors({
                    ...errors,
                    password: "",
                  });
                }}
                onChange={handleChange}
                value={input.password}
                placeholder="Password"
                fullWidth
                size="small"
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.password}
              </span>
            </Box>
          </Box>

          <Box mt={1} textAlign={"center"}>
            <Typography sx={{ fontSize: "11px" }}>
              People who use our service may have uploaded your contact
              information to Facebook. Learn more.{" "}
            </Typography>

            <Typography sx={{ fontSize: "11px" }}>
              By clicking Sign Up, you agree to our Terms, Privacy Policy and
              Cookies Policy. You may receive SMS Notifications from us and can
              opt out any time.
            </Typography>
          </Box>

          <Box mt={2} textAlign={"center"}>
            <Button
              onClick={handleSubmit}
              sx={{
                textTransform: "capitalize",
                fontSize: "15px",
                margin: "0 auto",
                display: "block",
                bgcolor: "green",
                color: "white",
                padding: "10px 60px",
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Box mt={1} textAlign={"center"}>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              sx={{
                textTransform: "capitalize",
                fontSize: "15px",
                color: "blue",
              }}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default CreateAccount;
