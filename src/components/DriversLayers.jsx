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
  TextField,
  Checkbox, FormControlLabel
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport,GridToolbar } from '@mui/x-data-grid';
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { Controller, useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const DriversLayers = () => {
  const [orders, setOrders] = useState([]);
  console.log("Orders1",orders)
  const [selectedRows, setSelectedRows] = useState([]);
const [open, setOpen]=useState(false);
const [submitting, setSubmitting] = useState(false)
const [refresh, setRefresh] = React.useState(false)
const[RowID,setRowID]=React.useState(0)

  const fields = [
  "id",
    "Active",
    "Depot",
    "DepotId",
    "HomeAddress",
    "Name" ,
    "Number",
    "Phone",
    "Username",
    "Vehicle",
    "Zone",
  ] ;
 const defValues = {
  id: 0,
  Number: '',
  Active: '',
  Depot: '',
  DepotId: '',
  HomeAddress: '',
  Name: '',
  Phone: '',
  Username: '',
  Vehicle: '',
  Zone: '',
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
    fetch('https://trackpod-server.vercel.app/drivers', {
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
  const apiUrl = 'http://localhost:9001/drivers111/add';
  const headers = {
    'Content-Type': 'application/json',
  };

  axios
    .post(apiUrl, postData, { headers })
    .then((response) => {
      setRefresh((prev) => !prev); // Toggle refresh state
      setOpen(false); // Close modal/form
      fields.forEach((field) => setValue(field, '')); // Reset form fields
      setRowID(0); // Reset row ID

      Swal.fire({
        title: 'Driver Added',
        text: 'Driver added successfully',
        icon: 'success',
        timer: 1000,
        willOpen: () => {
          // Apply inline CSS to set high z-index for SweetAlert2 popup
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500;';
          }
        },
      });
    })
    .catch((error) => {
      console.error('Error adding Driver:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add Driver',
        icon: 'error',
        timer: 2000,
        willOpen: () => {
          // Apply inline CSS to set high z-index for SweetAlert2 popup
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500;';
          }
        },
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
      field: 'Name',
      headerName: 'Name',
      width: 130,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Username',
      headerName: 'User Name',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'HomeAddress',
      headerName: 'Address',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Vehicle',
      headerName: 'Vehicle',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DepotId',
      headerName: 'Depot Id',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Depot',
      headerName: 'Depot',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Zone',
      headerName: 'Zone',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
  ];

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
          <Typography variant="h6">Driver</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
           onClick={handleClickOpen}
          >
            Add Driver
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
            Add Driver
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
            <Typography sx={{ fontSize: '15px' }}>Name</Typography>
            <Controller
              name="Name"
              {...register("Name")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Name"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Username</Typography>
            <Controller
              name="Username"
              {...register("Username")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Username"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
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
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>DepotId</Typography>
            <Controller
              name="DepotId"
              {...register("DepotId")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter DepotId"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Address</Typography>
            <Controller
              name="HomeAddress"
              {...register("HomeAddress")}
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
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Phone</Typography>
            <Controller
              name="Phone"
              {...register("Phone")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Phone"
                  {...field}
                  fullWidth
                  type="number"

                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Vehicle</Typography>
            <Controller
              name="Vehicle"
              {...register("Vehicle")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Vehicle"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Zone</Typography>
            <Controller
              name="Zone"
              {...register("Zone")}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  placeholder="Enter Zone"
                  {...field}
                  fullWidth
                />
              )}
            />
          </Grid> 
             <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
            <Typography sx={{ fontSize: '15px' }}>Active</Typography>
            <Controller
    name="Active"
    {...register("Active")}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            checked={field.value || false}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        }
        label="Active"
      />
    )}
  />
          </Grid>
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

export default DriversLayers;