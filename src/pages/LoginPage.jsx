"use client"
 import { useState, useEffect } from "react"
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
import { useNavigate } from "react-router-dom";

const LoginLayer = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const theme = useTheme()
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    setMounted(true)
    // Add the animated background class to the body
    document.body.classList.add("animated-bg")

    return () => {
      document.body.classList.remove("animated-bg")
    }
  }, [])

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
      const response = await axios.post("http://trackpod-server.vercel.app/users/api/auth/signin", {
        email: data.email,
        password: data.password,
      })

      // Store the token in localStorage
      localStorage.setItem("access_token", response.data.access_token)

      // Show success message
      alert("Login successful!")
    navigate("/")

      // Redirect or update state as needed
      // window.location.href = '/dashboard';
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Failed to login. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
      className="login-container"
    >
      {/* Animated background elements */}
      <Box className="bg-shapes">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`shape shape-${i + 1}`}></div>
        ))}
      </Box>

      {/* Glass overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          zIndex: 1,
        }}
      />

      {/* Content container */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left side - Branding */}
          <Box
            sx={{
              flex: isMobile ? "none" : "0 0 45%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 4,
              height: isMobile ? "auto" : "100%",
              mt: isMobile ? 4 : 0,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "white",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
              className="fade-in-up"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                maxWidth: "600px",
                lineHeight: 1.5,
                textShadow: "0 1px 5px rgba(0,0,0,0.2)",
              }}
              className="fade-in-up delay-1"
            >
              Sign in to access your account and continue your journey with us.
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
              }}
              className="fade-in-up delay-2"
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  maxWidth: "500px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontStyle: "italic",
                    mb: 2,
                  }}
                >
                  "The platform has transformed how we manage our projects. Highly recommended!"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    JD
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "white", fontWeight: "bold" }}>
                      John Doe
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      CEO, Tech Innovations
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right side - Login Form */}
          <Box
            sx={{
              flex: isMobile ? "none" : "0 0 45%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              height: isMobile ? "auto" : "100%",
              width: isMobile ? "100%" : "auto",
            }}
            className="fade-in-up delay-3"
          >
            <Paper
              elevation={24}
              sx={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease-in-out",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
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
                <Typography variant="h4" component="h2" fontWeight="bold">
                  Sign In
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
        </Box>
      </Container>
    </Box>
  )
}

export default LoginLayer
