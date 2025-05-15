import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Modal,
  TextField
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport,GridToolbar } from '@mui/x-data-grid';
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { Controller, useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const OrdersLayer = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
const [open, setOpen]=useState(false);
const [submitting, setSubmitting] = useState(false)
const [refresh, setRefresh] = React.useState(false)
const[RowID,setRowID]=React.useState(0)

  const fields = [
  "id",
    "Number",
    "Date",
    "SeqNumber",
    "RouteNumber",
    "RouteDate" ,
    "ShipperId",
    "Shipper",
    "DepotId",
    "Depot",
    "ClientId",
    "Client",
    "AddressId",
    "Address",
    "AddressLat",
    "AddressLon",
    "TimeSlotFrom",
    "TimeSlotTo",
    "ServiceTime",
    "Note",
    "ContactName",
    "Phone",
    "Email",
    "Weight",
    "Volume",
    "COD",
    "StatusId",
  ] ;
 const defValues = {
  id: 0,
  Number: '',
  Date: '',
  SeqNumber: 0,
  RouteNumber: '',
  RouteDate: '',
  ShipperId: 0,
  Shipper: '',
  DepotId: 0,
  Depot: '',
  ClientId: 0,
  Client: '',
  AddressId: 0,
  Address: '',
  AddressLat: 0.0,
  AddressLon: 0.0,
  TimeSlotFrom: '',
  TimeSlotTo: '',
  ServiceTime: 0,
  Note: '',
  ContactName: '',
  Phone: '',
  Email: '',
  Weight: 0.0,
  Volume: 0.0,
  COD: 0.0,
  StatusId: 0
};
  const {
      register,
      control,
      handleSubmit,
      setValue,
      reset,
      getValues,
      formState: { errors },
    } = useForm({
      mode: "onBlur",
      reValidateMode: "onChange",
      context: undefined,
      criteriaMode: "firstError",
      shouldFocusError: true,
      shouldUnregister: false,
      shouldUseNativeValidation: false,
      delayError: undefined,
      // resolver: yupResolver(validationSchema),
      defaultValues: defValues,
    });


  useEffect(() => {
    fetch('https://trackpod-server.vercel.app/orders', {
      headers: {
        accept: 'text/plain',
        'X-API-KEY': '0c340847-b764-4ff8-9250-0bb089486648',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          console.log('Orders loaded:', data); // Debug: Check API data
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => console.error('API Error:', error));
  }, []);

  // Debug: Log selected rows whenever selection changes
  const handleRowSelection = (newSelection) => {
    console.log('Selected rows:', newSelection); // Debug: Verify selection
    setSelectedRows(newSelection);
  };
const onSubmit = (data) => {
  setSubmitting(true);

  const postData = data; // Adjust this based on the API's expected payload
  const apiUrl = 'http://localhost:5000/orders1/create1'; // Use the curl example's endpoint
  const headers = {
    'Content-Type': 'application/json',
    // Add other headers if needed, e.g., Authorization
  };

  axios
    .post(apiUrl, postData, { headers })
    .then((response) => {
      setRefresh((prev) => !prev); // Toggle refresh state
      setOpen(false); // Close modal/form
      fields.forEach((field) => setValue(field, '')); // Reset form fields
      setRowID(0); // Reset row ID

      Swal.fire({
        title: 'Order Added',
        text: 'Order added successfully',
        icon: 'success',
        timer: 1000,
      });
    })
    .catch((error) => {
      console.error('Error adding Oeder:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add Order',
        icon: 'error',
        timer: 2000,
      });
    })
    .finally(() => {
      setSubmitting(false); // Always reset submitting state
    });
};
  const columns = [
    {
      field: 'Number',
      headerName: 'Order #',
      width: 70,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Date',
      headerName: 'Date',
      width: 110,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Client',
      headerName: 'Client',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Address',
      headerName: 'Address',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 130,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Email',
      headerName: 'Email',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Phone',
      headerName: 'Phone',
      width: 130,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Note',
      headerName: 'Note',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DriverName',
      headerName: 'Driver',
      width: 130,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'TrackLink',
      headerName: 'Tracking',
      width: 160,
      renderCell: (params) => (
        params.row.TrackLink ? (
          <a
            href={params.row.TrackLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#005BFF', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            Track Order
          </a>
        ) : (
          'N/A'
        )
      ),
    },
  ];

  // Custom toolbar with export button
const CustomToolbar = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Selected Rows: {selectedRows.length}
        </Typography>
      </Box>
    );
  };
const handleClickOpen =()=>{
  setOpen(true)
}
    const handleClose =()=>{
      setOpen(false)
      fields.forEach((field) => setValue(field, ''));
      setRowID(0)
    }
  return (
 <Box>
  <Card className="card" style={{ marginTop: '30px' }}>
    <CardContent>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h6">Order</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
           onClick={handleClickOpen}
          >
            Add Order
          </Button>
        </Grid>
      </Grid>
       <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '850px',
          backgroundColor: '#ffffff', // Pure white background
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            id="modal-modal-title"
            sx={{
              marginBottom: '20px',
              textDecoration: 'underline',
              fontSize: '19px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Add Order
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ color: '#ff4d4f',marginTop:"-20px" }}
          >
            <CancelTwoToneIcon />
          </IconButton>
        </div>
     <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
             <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Number</Typography>
            <Controller
              name="Number"
              {...register("Number")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Number"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Date</Typography>
            <Controller
              name="Date"
              {...register("Date")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Date (e.g., 2023-08-08T10:00:00)"
                  {...field}
                  fullWidth
                  type="datetime-local"
                />
              )}
            />
          </Grid>
          {/* SeqNumber */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Sequence Number</Typography>
            <Controller
              name="SeqNumber"
              {...register("SeqNumber")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Sequence Number"
                  {...field}
                  fullWidth
                  type="number"
                />
              )}
            />
          </Grid>
          {/* RouteNumber */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Route Number</Typography>
            <Controller
              name="RouteNumber"
              {...register("RouteNumber")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Route Number"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* RouteDate */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Route Date</Typography>
            <Controller
              name="RouteDate"
              {...register("RouteDate")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Route Date"
                  {...field}
                  fullWidth
                  type="datetime-local"
                />
              )}
            />
          </Grid>
          {/* ShipperId */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Shipper ID</Typography>
            <Controller
              name="ShipperId"
              {...register("ShipperId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Shipper ID"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Shipper */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Shipper</Typography>
            <Controller
              name="Shipper"
              {...register("Shipper")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Shipper"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* DepotId */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Depot ID</Typography>
            <Controller
              name="DepotId"
              {...register("DepotId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Depot ID"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Depot */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Depot</Typography>
            <Controller
              name="Depot"
              {...register("Depot")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Depot"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* ClientId */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Client ID</Typography>
            <Controller
              name="ClientId"
              {...register("ClientId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Client ID"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Client */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Client</Typography>
            <Controller
              name="Client"
              {...register("Client")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Client"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* AddressId */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Address ID</Typography>
            <Controller
              name="AddressId"
              {...register("AddressId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Address ID"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Address */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Address</Typography>
            <Controller
              name="Address"
              {...register("Address")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Address"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* AddressLat */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Address Latitude</Typography>
            <Controller
              name="AddressLat"
              {...register("AddressLat")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Latitude"
                  {...field}
                  fullWidth
                  type="number"
                  step="any"
                />
              )}
            />
          </Grid>
          {/* AddressLon */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Address Longitude</Typography>
            <Controller
              name="AddressLon"
              {...register("AddressLon")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Longitude"
                  {...field}
                  fullWidth
                  type="number"
                  step="any"
                />
              )}
            />
          </Grid>
          {/* TimeSlotFrom */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Time Slot From</Typography>
            <Controller
              name="TimeSlotFrom"
              {...register("TimeSlotFrom")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Time Slot From"
                  {...field}
                  fullWidth
                  type="datetime-local"
                />
              )}
            />
          </Grid>
          {/* TimeSlotTo */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Time Slot To</Typography>
            <Controller
              name="TimeSlotTo"
              {...register("TimeSlotTo")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Time Slot To"
                  {...field}
                  fullWidth
                  type="datetime-local"
                />
              )}
            />
          </Grid>
          {/* ServiceTime */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Service Time (minutes)</Typography>
            <Controller
              name="ServiceTime"
              {...register("ServiceTime")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Service Time"
                  {...field}
                  fullWidth
                  type="number"
                />
              )}
            />
          </Grid>
          {/* Note */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Note</Typography>
            <Controller
              name="Note"
              {...register("Note")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Note"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* ContactName */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Contact Name</Typography>
            <Controller
              name="ContactName"
              {...register("ContactName")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Contact Name"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          {/* Phone */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Phone</Typography>
            <Controller
              name="Phone"
              {...register("Phone")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Phone Number"
                  {...field}
                  fullWidth
                  type="tel"
                />
              )}
            />
          </Grid>
          {/* Email */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Email</Typography>
            <Controller
              name="Email"
              {...register("Email")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Email"
                  {...field}
                  fullWidth
                  type="email"
                />
              )}
            />
          </Grid>
          {/* Weight */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Weight</Typography>
            <Controller
              name="Weight"
              {...register("Weight")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Weight"
                  {...field}
                  fullWidth
                  type="number"
                  step="any"
                />
              )}
            />
          </Grid>
          {/* Volume */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Volume</Typography>
            <Controller
              name="Volume"
              {...register("Volume")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Volume"
                  {...field}
                  fullWidth
                  type="number"
                  step="any"
                />
              )}
            />
          </Grid>
          {/* COD */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>COD</Typography>
            <Controller
              name="COD"
              {...register("COD")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter COD"
                  {...field}
                  fullWidth
                  type="number"
                  step="any"
                />
              )}
            />
          </Grid>
          {/* StatusId */}
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Status ID</Typography>
            <Controller
              name="StatusId"
              {...register("StatusId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Status ID"
                  {...field}
                  fullWidth
                  type="number"
                />
              )}
            />
          </Grid>
        {/* <Grid item xs={12} container justifyContent="flex-end">
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          className="custom-button"
          style={{ margin: "10px", width: "130px" }}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </Grid>
 <Grid item xs={12} container justifyContent="flex-end">
        <Button
            onClick={handleClose}
          variant="contained"
          className="custom-button"
          style={{ margin: "10px", width: "130px" }}
          startIcon={<SaveIcon />}
        >
          Cancel
        </Button>
      </Grid> */}
 
          </Grid>
          </Grid>
        </Grid>
             <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
  <Button
    onClick={handleSubmit(onSubmit)}
    variant="contained"
    className="custom-button"
    style={{ margin: "10px", width: "130px" }}
    startIcon={<SaveIcon />}
  >
    Save
  </Button>
  <Button
    onClick={handleClose}
    variant="contained"
    className="custom-button"
    style={{ margin: "10px", width: "130px" }}
    startIcon={<SaveIcon />}
  >
    Cancel
  </Button>
</div>
      </Box>
    </Modal>
      <Box
        sx={{
          height: 'auto',
          width: '100%',
          marginTop: 1,
          '& .super-app-theme--header': {
            backgroundColor: '#a7b61b23',
          },
        }}
      >
<DataGrid
              rows={orders}
              columns={columns}
              getRowId={(row) => row._id || row.Number}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection}
              slots={{
                toolbar: GridToolbar, // Use the deprecated but functional GridToolbar
              }}
              slotProps={{
                toolbar: {
                  csvOptions: {
                    fileName: 'selected_orders_export',
                    utf8WithBom: true,
                  },
                  printOptions: { disableToolbarButton: true }, // Disable print if not needed
                },
              }}
            />
      </Box>
    </CardContent>
  </Card>
</Box>
  );
};

export default OrdersLayer;