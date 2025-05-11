import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
 
import DriversLayers from "../components/DriversLayers";


const DriversPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Drivers" />

        {/* EmailLayer */}
        <DriversLayers />



      </MasterLayout>
    </>
  );
};

export default DriversPage;
