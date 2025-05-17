"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useForm } from "react-hook-form"

const AddUserLayer = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [showError, setShowError] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      userType: "",
      password: "",
      email: "",
      mobile: "",
      profilePicture: "",
    },
  })

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showError])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "gptimages")

      const response = await fetch(`https://api.cloudinary.com/v1_1/dgmjg9zr4/image/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.secure_url) {
        setValue("profilePicture", data.secure_url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setApiError(null)
      setShowError(false)

      const response = await fetch("https://trackpod-server.vercel.app/users/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // Get response text first
      const responseText = await response.text()

      // Check if the response is the specific error message
      if (responseText.includes("That user already exists!")) {
        setApiError("That user already exists!")
        setShowError(true)

        // Set field errors for username and email
        setError("username", {
          type: "manual",
          message: "Username already taken",
        })
        setError("email", {
          type: "manual",
          message: "Email already registered",
        })
        return
      }

      // Try to parse as JSON if it's not the specific error
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        // If it's not JSON, use the text as the error message
        if (!response.ok) {
          setApiError(responseText || "An error occurred")
          setShowError(true)
          return
        }
      }
console.log(response,'response_--')
      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to register user")
      }

      // Success - reset form or redirect
      reset()
      setImagePreviewUrl("")

      // Show success message
      setApiError({ type: "success", message: "User registered successfully!" })
      setShowError(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setApiError(error.message || "Failed to register user. Please try again.")
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearImage = () => {
    setImagePreviewUrl("")
    setValue("profilePicture", "")
  }

  const dismissError = () => {
    setShowError(false)
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
          <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div className="card border">
              <div className="card-body">
                <h6 className="text-md text-primary-light mb-16">User Registration</h6>

                {/* Profile Image Upload */}
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleImageChange}
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        {isUploading ? (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <Icon icon="solar:camera-outline" className="icon" />
                        )}
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : "",
                        }}
                      >
                        {imagePreviewUrl && (
                          <button
                            type="button"
                            onClick={clearImage}
                            className="position-absolute top-0 end-0 bg-danger-600 text-white p-1 rounded-circle border-0"
                            style={{ width: "24px", height: "24px" }}
                          >
                            <Icon icon="mdi:close" width="16" height="16" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6 mb-20">
                      <label htmlFor="firstName" className="form-label fw-semibold text-primary-light text-sm mb-8">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="firstName"
                        placeholder="Enter First Name"
                        {...register("firstName")}
                      />
                    </div>

                    <div className="col-md-6 mb-20">
                      <label htmlFor="lastName" className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="lastName"
                        placeholder="Enter Last Name"
                        {...register("lastName")}
                      />
                    </div>
                  </div>

                  <div className="mb-20">
                    <label htmlFor="username" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Username <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control radius-8 ${errors.username ? "is-invalid" : ""}`}
                      id="username"
                      placeholder="Enter Username"
                      {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                  </div>

                  <div className="mb-20">
                    <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Email <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control radius-8 ${errors.email ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="Enter email address"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  <div className="mb-20">
                    <label htmlFor="password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Password <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control radius-8 ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Enter password (min 8 characters)"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <div className="mb-20">
                    <label htmlFor="mobile" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control radius-8"
                      id="mobile"
                      placeholder="Enter phone number"
                      {...register("mobile")}
                    />
                  </div>

                  <div className="mb-20">
                    <label htmlFor="userType" className="form-label fw-semibold text-primary-light text-sm mb-8">
                      User Type <span className="text-danger-600">*</span>
                    </label>
                    <select
                      className={`form-control radius-8 form-select ${errors.userType ? "is-invalid" : ""}`}
                      id="userType"
                      {...register("userType", { required: "User type is required" })}
                    >
                      <option value="" disabled selected>
                        Select User Type
                      </option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                    {errors.userType && <div className="invalid-feedback">{errors.userType.message}</div>}
                  </div>

                  {/* Error message before buttons */}
                  {showError && apiError && (
                    <div className="mb-20">
                      <div
                        className={`d-flex align-items-center p-3 border ${apiError.type === "success" ? "border-success-300 bg-success-50 text-success-700" : "border-danger-300 bg-danger-50 text-danger-700"} radius-8`}
                      >
                        <Icon
                          icon={apiError.type === "success" ? "mdi:check-circle" : "mdi:alert-circle"}
                          className="me-2"
                          width="20"
                          height="20"
                        />
                        <div className="flex-grow-1">{apiError.type === "success" ? apiError.message : apiError}</div>
                        <button
                          type="button"
                          className="bg-transparent border-0 p-0 text-danger-700"
                          onClick={dismissError}
                          aria-label="Close"
                        >
                          <Icon icon="mdi:close" width="16" height="16" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon icon="eos-icons:loading" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserLayer
