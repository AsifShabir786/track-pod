// src/App.js
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import HomePageFour from "./pages/HomePageFour";
import HomePageFive from "./pages/HomePageFive";
import HomePageSix from "./pages/HomePageSix";
import HomePageSeven from "./pages/HomePageSeven";
import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import ErrorPage from "./pages/ErrorPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import TextGeneratorNewPage from "./pages/TextGeneratorNewPage";
import Orderspage from "./pages/Orderspage";
import DriversPage from "./pages/DriversPage";
import VehiclesPage from "./pages/VehiclesPage";
import LoginPage from "./pages/LoginPage";
import UsersListPage from "./pages/UsersListPage";
import UsersGridPage from "./pages/UsersGridPage";
import ViewProfilePage from "./pages/ViewProfilePage";

import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Public route */}
        <Route exact path="/LoginPage" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <HomePageOne />
            </ProtectedRoute>
          }
        />
                <Route exact path="/users-list" element={ <ProtectedRoute>
<UsersListPage />            </ProtectedRoute>} />
        <Route exact path="/users-grid" element={<UsersGridPage />} />
        <Route exact path="/view-profile" element={<ViewProfilePage />} />

        <Route
          exact
          path="/index-2"
          element={
            <ProtectedRoute>
              <HomePageTwo />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/index-3"
          element={
            <ProtectedRoute>
              <HomePageThree />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/index-4"
          element={
            <ProtectedRoute>
              <HomePageFour />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/index-5"
          element={
            <ProtectedRoute>
              <HomePageFive />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/index-6"
          element={
            <ProtectedRoute>
              <HomePageSix />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/index-7"
          element={
            <ProtectedRoute>
              <HomePageSeven />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/Orderspage"
          element={
            <ProtectedRoute>
              <Orderspage />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/DriversPage"
          element={
            <ProtectedRoute>
              <DriversPage />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/VehiclesPage"
          element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes similarly */}

        {/* Catch all route */}
        <Route
          exact
          path="*"
          element={
            <ProtectedRoute>
              <ErrorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
