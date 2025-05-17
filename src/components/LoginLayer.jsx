"use client"

import { useState } from "react"
import {
  Button,
  Box,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Container,
  Alert,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined"

const LoginLayer = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:9001/users/api/auth/signin", {
        email: data.email,
        password: data.password,
      })

      // Store the token in localStorage
      localStorage.setItem("access_token", response.data.access_token)

      // Show success message
      alert("Login successful!")

      // Redirect or update state as needed
      // window.location.href = '/dashboard';
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Failed to login. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Sign in to continue to your account
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 3 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap" }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot Password?
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Create an Account
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlinedIcon />}
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginLayer
