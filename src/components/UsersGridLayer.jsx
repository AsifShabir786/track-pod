import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

const UsersGridLayer = () => {

        const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:9001/users/api/auth/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Failed to fetch users:', err));
    }, []);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Number">
                        <option value="Select Number" disabled>
                            Select Number
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                </div>
                <Link
                    to="/view-profile"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add New User
                </Link>
            </div>
            <div className="card-body p-24">
        <div className="row gy-4">
  {users.map((user) => (
    <div key={user._id} className="col-xxl-3 col-md-6 user-grid-card">
      <div className="position-relative border radius-16 overflow-hidden">
        {/* Background image - Added height control and styling */}
        <div className="user-card-banner" style={{ 
          height:   "160px", 
        //   backgroundImage: `url(${user.coverPhoto || "assets/images/user-grid/user-grid-bg1.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center" 
        }}></div>
        
        {/* Dropdown menu */}
        <div className="dropdown position-absolute top-0 end-0 me-16 mt-16">
          <button
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            className="bg-white-gradient-light w-32-px h-32-px radius-8 border border-light-white d-flex justify-content-center align-items-center text-white"
          >
            <Icon icon="entypo:dots-three-vertical" className="icon" />
          </button>
          <ul className="dropdown-menu p-12 border bg-base shadow">
            <li>
              <Link className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10" href="#">
                Edit
              </Link>
            </li>
            <li>
              <button type="button" className="delete-btn dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10">
                Delete
              </button>
            </li>
          </ul>
        </div>
        
        {/* User profile section */}
        <div className="ps-16 pb-16 pe-16 text-center" style={{ marginTop: "-50px" }}>
          <div className="position-relative d-inline-block">
            <img
              src={user.profilePicture || "assets/images/user-grid/user-grid-img1.png"}
              alt={`${user.firstName} ${user.lastName}`}
              className="border br-white border-width-2-px w-100-px h-100-px rounded-circle object-fit-cover"
              style={{ border: "4px solid white" }}
            />
          </div>
          <h6 className="text-lg mb-0 mt-4">{user.firstName} {user.lastName}</h6>
          <span className="text-secondary-light mb-16 d-block">{user.email}</span>
          
          <div className="center-border position-relative bg-danger-gradient-light radius-8 p-12 d-flex align-items-center gap-4">
            <div className="text-center w-50">
              <h6 className="text-md mb-0">{user.role || 'N/A'}</h6>
              <span className="text-secondary-light text-sm mb-0">Role</span>
            </div>
            <div className="text-center w-50">
              <h6 className="text-md mb-0">{user.gender || 'N/A'}</h6>
              <span className="text-secondary-light text-sm mb-0">Gender</span>
            </div>
          </div>
          
          {/* <Link
            to={`/view-profile/${user._id}`}
            className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-10 text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-100"
          >
            View Profile
            <Icon icon="solar:alt-arrow-right-linear" className="icon text-xl line-height-1" />
          </Link> */}
        </div>
      </div>
    </div>
  ))}
</div>


                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>Showing 1 to 10 of 12 entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                to="#"
                            >
                                <Icon icon="ep:d-arrow-left" className="" />
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                                to="#"
                            >
                                1
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                to="#"
                            >
                                2
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                3
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                4
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                5
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                to="#"
                            >
                                {" "}
                                <Icon icon="ep:d-arrow-right" className="" />{" "}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default UsersGridLayer;