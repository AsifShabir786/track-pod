import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewProfileLayer = () => {
    // State for user data
    const [userData, setUserData] = useState({
        user: {
            firstName: '',
            lastName: '',
            email: '',
            profilePicture: '',
            coverPhoto: '',
            desc: '',
            gender: '',
            dateOfBirth: '',
            role: '',
            username: '',
            mobile: ''
        }
    });
    
    // State for password fields
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Load user data from localStorage on component mount
    useEffect(() => {
        try {
            const storedUserData = JSON.parse(localStorage.getItem("currentLoggedinUser") || "{}");
            console.log(storedUserData, 'userData______');
            if (storedUserData && storedUserData.user) {
                setUserData(storedUserData);
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
        }
    }, []);

    // Toggle function for password field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Handle image upload
    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserData(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        profilePicture: e.target.result
                    }
                }));
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData(prev => ({
            ...prev,
            user: {
                ...prev.user,
                [id]: value
            }
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Extract the user ID from stored data
            const userId = userData.user._id || 'USER_ID_HERE';
            
            // Prepare the data for the API call
            const updatedData = {
                firstName: userData.user.firstName,
                lastName: userData.user.lastName,
                email: userData.user.email,
                mobile: userData.user.mobile || '',
                username: userData.user.username,
                gender: userData.user.gender,
                dateOfBirth: userData.user.dateOfBirth,
                desc: userData.user.desc,
                profilePicture: userData.user.profilePicture
            };
            
            // Make the API call
            const response = await axios.put(
                `https://trackpod-server.vercel.app/users/api/auth/update/${userId}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log("API response:", response.data);
            
            // Update localStorage with the latest data
            if (response.data && response.data.success) {
                const updatedUserData = {
                    ...userData,
                    user: {
                        ...userData.user,
                        ...updatedData
                    }
                };
                localStorage.setItem("currentLoggedinUser", JSON.stringify(updatedUserData));
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle password update
    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        if (!newPassword) {
            alert("Password cannot be empty!");
            return;
        }
        
        setLoading(true);
        try {
            const userId = userData.user._id || 'USER_ID_HERE';
            
            const response = await axios.put(
                `https://trackpod-server.vercel.app/users/api/auth/update/${userId}`,
                { password: newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data && response.data.success) {
                alert("Password updated successfully!");
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert("Failed to update password. Please try again.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Error updating password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row gy-4">
            <div className="col-lg-12">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={readURL}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                            >
                                                <Icon icon="solar:camera-outline" />
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${userData.user.profilePicture || 'assets/images/user-grid/user-grid-img13.png'})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Upload Image End */}
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="firstName"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    First Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="firstName"
                                                    placeholder="Enter First Name"
                                                    value={userData.user.firstName || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="lastName"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Last Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="lastName"
                                                    placeholder="Enter Last Name"
                                                    value={userData.user.lastName || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="username"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Username
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="username"
                                                    placeholder="Enter Username"
                                                    value={userData.user.username || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control radius-8"
                                                    id="email"
                                                    placeholder="Enter email address"
                                                    value={userData.user.email || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="mobile"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Mobile <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control radius-8"
                                                    id="mobile"
                                                    placeholder="Enter mobile number"
                                                    value={userData.user.mobile || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="dateOfBirth"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    className="form-control radius-8"
                                                    id="dateOfBirth"
                                                    value={userData.user.dateOfBirth ? new Date(userData.user.dateOfBirth).toISOString().split('T')[0] : ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="gender"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Gender
                                                </label>
                                                <select
                                                    className="form-control radius-8 form-select"
                                                    id="gender"
                                                    value={userData.user.gender || ''}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="role"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="role"
                                                    placeholder="Role"
                                                    value={userData.user.role || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="desc"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    className="form-control radius-8"
                                                    id="desc"
                                                    placeholder="Write description..."
                                                    value={userData.user.desc || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex={0}>
                                <div className="mb-20">
                                    <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        New Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="your-password"
                                            placeholder="Enter New Password*"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span
                                            className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={togglePasswordVisibility}
                                        >
                                            <Icon icon={passwordVisible ? "ri:eye-off-line" : "ri:eye-line"} />
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-20">
                                    <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Confirm Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="confirm-password"
                                            placeholder="Confirm Password*"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span
                                            className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            <Icon icon={confirmPasswordVisible ? "ri:eye-off-line" : "ri:eye-line"} />
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                                    <button
                                        type="button"
                                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                        onClick={handlePasswordUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileLayer;