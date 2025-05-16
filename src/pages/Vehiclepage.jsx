import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
 import OrdersLayer from "../components/OrdersLayer";
import VehicleLayer from "../components/VehicleLayer";


const Vehiclepage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vehicle" />

        {/* EmailLayer */}
        <VehicleLayer />


      </MasterLayout>
    </>
  );
};

export default Vehiclepage;
