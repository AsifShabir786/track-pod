import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
 
 import VehiclesLayers from "../components/VehiclesLayers";


const VehiclesPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vehicles" />

        {/* EmailLayer */}
        <VehiclesLayers  />



      </MasterLayout>
    </>
  );
};

export default VehiclesPage;
