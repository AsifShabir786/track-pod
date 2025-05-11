import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
 import OrdersLayer from "../components/OrdersLayer";


const Orderspage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Orders" />

        {/* EmailLayer */}
        <OrdersLayer />


      </MasterLayout>
    </>
  );
};

export default Orderspage;
