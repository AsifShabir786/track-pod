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
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const OrdersLayer = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [RowID, setRowID] = React.useState(0);

  // Updated fields array to include all payload fields
  const fields = [
    '_id',
    'Number',
    'Date',
    'SeqNumber',
    'RouteNumber',
    'RouteDate',
    'RouteStatus',
    'DriverLogin',
    'DriverName',
    'DriverNumber',
    'DriverVehicle',
    'Type',
    'ShipperId',
    'Shipper',
    'DepotId',
    'Depot',
    'Client',
    'Address',
    'AddressLat',
    'AddressLon',
    'AddressZone',
    'TimeSlotFrom',
    'TimeSlotTo',
    'ServiceTime',
    'Note',
    'ContactName',
    'Phone',
    'Email',
    'Weight',
    'Volume',
    'Pallets',
    'COD',
    'CODActual',
    'StatusId',
    'Status',
    'StatusLat',
    'StatusLon',
    'DriverComment',
    'HasSignaturePhoto',
    'HasPhoto',
    'Photos',
    'StatusDate',
    'ETA',
    'ArrivedDate',
    'DepartedDate',
    'GoodsList',
    'ReportUrl',
    'CustomFields',
    'Barcode',
    'Scanned',
    'TrackKey',
    'TrackId',
    'TrackLink',
    'LoadStatus',
    'LoadDate',
    'ChangeDate',
    'CreateSource',
    'DistanceFromDepotPlan',
    'Pin',
    'CreateDateUtc',
    '__v',
  ];

  // Updated defaultValues to include all payload fields
  const defValues = {
    _id: 0,
    Number: '',
    Date: '',
    SeqNumber: 0,
    RouteNumber: '',
    RouteDate: '',
    RouteStatus: '',
    DriverLogin: '',
    DriverName: '',
    DriverNumber: 0,
    DriverVehicle: '',
    Type: 0,
    ShipperId: '',
    Shipper: '',
    DepotId: '',
    Depot: '',
    Client: '',
    Address: '',
    AddressLat: 0.0,
    AddressLon: 0.0,
    AddressZone: '',
    TimeSlotFrom: '',
    TimeSlotTo: '',
    ServiceTime: 0,
    Note: '',
    ContactName: '',
    Phone: '',
    Email: '',
    Weight: 0.0,
    Volume: 0.0,
    Pallets: 0,
    COD: 0.0,
    CODActual: '',
    StatusId: 0,
    Status: '',
    StatusLat: 0.0,
    StatusLon: 0.0,
    DriverComment: '',
    HasSignaturePhoto: false,
    HasPhoto: false,
    Photos: '',
    StatusDate: '',
    ETA: '',
    ArrivedDate: '',
    DepartedDate: '',
    GoodsList: '',
    ReportUrl: '',
    CustomFields: '',
    Barcode: '',
    Scanned: false,
    TrackKey: '',
    TrackId: '',
    TrackLink: '',
    LoadStatus: '',
    LoadDate: '',
    ChangeDate: '',
    CreateSource: '',
    DistanceFromDepotPlan: 0,
    Pin: '',
    CreateDateUtc: '',
    __v: 0,
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
    mode: 'onBlur',
    reValidateMode: 'onChange',
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
    shouldgenuinValidation: false,
    delayError: undefined,
    defaultValues: defValues,
  });

  useEffect(() => {
    fetch('http://trackpod-server.vercel.app/orders', {
      headers: {
        accept: 'text/plain',
        'X-API-KEY': '0c340847-b764-4ff8-9250-0bb089486648',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedData = data.map((order) => ({
            ...order,
            Date: new Date(order.Date).toLocaleDateString('en-GB'), // e.g., "01/05/2025"
          }));
          setOrders(formattedData);
          console.log('Orders loaded:', formattedData); // Debug: Check API data
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => console.error('API Error:', error));
  }, [refresh]);

  const handleRowSelection = (newSelection) => {
    console.log('Selected rows:', newSelection);
    setSelectedRows(newSelection);
  };

  const onSubmit = (data) => {
    setSubmitting(true);

    // Convert array fields to JSON strings if needed
    const postData = {
      ...data,
      Photos: data.Photos ? JSON.parse(data.Photos) : [],
      GoodsList: data.GoodsList ? JSON.parse(data.GoodsList) : [],
      CustomFields: data.CustomFields ? JSON.parse(data.CustomFields) : [],
    };

    const apiUrl = 'http://localhost:5000/orders1/create11';
    const headers = {
      'Content-Type': 'application/json',
    };

    axios
      .post(apiUrl, postData, { headers })
      .then((response) => {
        setRefresh((prev) => !prev);
        setOpen(false);
        fields.forEach((field) => setValue(field, defValues[field]));
        setRowID(0);

        Swal.fire({
          title: 'Order Added',
          text: 'Order added successfully',
          icon: 'success',
          timer: 1000,
          willOpen: () => {
            const swalContainer = document.querySelector('.swal2-container');
            if (swalContainer) {
              swalContainer.style = 'z-index: 1500;';
            }
          },
        });
      })
      .catch((error) => {
        console.error('Error adding Order:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Failed to add Order',
          icon: 'error',
          timer: 2000,
          willOpen: () => {
            const swalContainer = document.querySelector('.swal2-container');
            if (swalContainer) {
              swalContainer.style = 'z-index: 1500;';
            }
          },
        });
      })
      .finally(() => {
        setSubmitting(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fields.forEach((field) => setValue(field, defValues[field]));
    setRowID(0);
  };

  return (
    <Box>
      <Card className="card" style={{ marginTop: '30px' }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h6">Order</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
                backgroundColor: '#ffffff',
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
                <IconButton onClick={handleClose} sx={{ color: '#ff4d4f', marginTop: '-20px' }}>
                  <CancelTwoToneIcon />
                </IconButton>
              </div>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    
                    {/* Number */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Number</Typography>
                      <Controller
                        name="Number"
                        {...register('Number')}
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
                    {/* Date */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Date</Typography>
                      <Controller
                        name="Date"
                        {...register('Date')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Date"
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
          control={control}
          {...register('SeqNumber')}
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
                        {...register('RouteNumber')}
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
                        {...register('RouteDate')}
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
                    {/* RouteStatus */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Route Status</Typography>
                      <Controller
                        name="RouteStatus"
                        {...register('RouteStatus')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Route Status"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* DriverLogin */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Driver Login</Typography>
                      <Controller
                        name="DriverLogin"
                        {...register('DriverLogin')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Driver Login"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* DriverName */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Driver Name</Typography>
                      <Controller
                        name="DriverName"
                        {...register('DriverName')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Driver Name"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* DriverNumber */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Driver Number</Typography>
                      <Controller
                        name="DriverNumber"
                        {...register('DriverNumber')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Driver Number"
                            {...field}
                            fullWidth
                            type="number"
                          />
                        )}
                      />
                    </Grid>
                    {/* DriverVehicle */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Driver Vehicle</Typography>
                      <Controller
                        name="DriverVehicle"
                        {...register('DriverVehicle')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Driver Vehicle"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* Type */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Type</Typography>
                      <Controller
                        name="Type"
                        {...register('Type')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Type"
                            {...field}
                            fullWidth
                            type="number"
                          />
                        )}
                      />
                    </Grid>
                    {/* ShipperId */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Shipper ID</Typography>
                      <Controller
                        name="ShipperId"
                        {...register('ShipperId')}
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
                        {...register('Shipper')}
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
                        {...register('DepotId')}
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
                        {...register('Depot')}
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
                    {/* Client */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Client</Typography>
                      <Controller
                        name="Client"
                        {...register('Client')}
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
                    {/* Address */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Address</Typography>
                      <Controller
                        name="Address"
                        {...register('Address')}
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
                        {...register('AddressLat')}
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
                        {...register('AddressLon')}
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
                    {/* AddressZone */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Address Zone</Typography>
                      <Controller
                        name="AddressZone"
                        {...register('AddressZone')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Address Zone"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* TimeSlotFrom */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Time Slot From</Typography>
                      <Controller
                        name="TimeSlotFrom"
                        {...register('TimeSlotFrom')}
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
                        {...register('TimeSlotTo')}
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
                        {...register('ServiceTime')}
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
                        {...register('Note')}
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
                        {...register('ContactName')}
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
                        {...register('Phone')}
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
                        {...register('Email')}
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
                        {...register('Weight')}
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
                        {...register('Volume')}
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
                    {/* Pallets */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Pallets</Typography>
                      <Controller
                        name="Pal

lets"
                        {...register('Pallets')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Pallets"
                            {...field}
                            fullWidth
                            type="number"
                          />
                        )}
                      />
                    </Grid>
                    {/* COD */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>COD</Typography>
                      <Controller
                        name="COD"
                        {...register('COD')}
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
                    {/* CODActual */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>COD Actual</Typography>
                      <Controller
                        name="CODActual"
                        {...register('CODActual')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter COD Actual"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* StatusId */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Status ID</Typography>
                      <Controller
                        name="StatusId"
                        {...register('StatusId')}
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
                    {/* Status */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Status</Typography>
                      <Controller
                        name="Status"
                        {...register('Status')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Status"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* StatusLat */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Status Latitude</Typography>
                      <Controller
                        name="StatusLat"
                        {...register('StatusLat')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Status Latitude"
                            {...field}
                            fullWidth
                            type="number"
                            step="any"
                          />
                        )}
                      />
                    </Grid>
                    {/* StatusLon */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Status Longitude</Typography>
                      <Controller
                        name="StatusLon"
                        {...register('StatusLon')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Status Longitude"
                            {...field}
                            fullWidth
                            type="number"
                            step="any"
                          />
                        )}
                      />
                    </Grid>
                    {/* DriverComment */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Driver Comment</Typography>
                      <Controller
                        name="DriverComment"
                        {...register('DriverComment')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Driver Comment"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* HasSignaturePhoto */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Has Signature Photo</Typography>
                      <Controller
                        name="HasSignaturePhoto"
                        {...register('HasSignaturePhoto')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Has Signature Photo (true/false)"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* HasPhoto */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Has Photo</Typography>
                      <Controller
                        name="HasPhoto"
                        {...register('HasPhoto')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Has Photo (true/false)"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* Photos */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Photos (JSON)</Typography>
                      <Controller
                        name="Photos"
                        {...register('Photos')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Photos as JSON array"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* StatusDate */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Status Date</Typography>
                      <Controller
                        name="StatusDate"
                        {...register('StatusDate')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Status Date"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* ETA */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>ETA</Typography>
                      <Controller
                        name="ETA"
                        {...register('ETA')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter ETA"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* ArrivedDate */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Arrived Date</Typography>
                      <Controller
                        name="ArrivedDate"
                        {...register('ArrivedDate')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Arrived Date"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* DepartedDate */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Departed Date</Typography>
                      <Controller
                        name="DepartedDate"
                        {...register('DepartedDate')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Departed Date"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* GoodsList */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Goods List (JSON)</Typography>
                      <Controller
                        name="GoodsList"
                        {...register('GoodsList')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Goods List as JSON array"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* ReportUrl */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Report URL</Typography>
                      <Controller
                        name="ReportUrl"
                        {...register('ReportUrl')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Report URL"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* CustomFields */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Custom Fields (JSON)</Typography>
                      <Controller
                        name="CustomFields"
                        {...register('CustomFields')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Custom Fields as JSON array"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* Barcode */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Barcode</Typography>
                      <Controller
                        name="Barcode"
                        {...register('Barcode')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Barcode"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* Scanned */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Scanned</Typography>
                      <Controller
                        name="Scanned"
                        {...register('Scanned')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Scanned (true/false)"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* TrackKey */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Track Key</Typography>
                      <Controller
                        name="TrackKey"
                        {...register('TrackKey')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Track Key"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* TrackId */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Track ID</Typography>
                      <Controller
                        name="TrackId"
                        {...register('TrackId')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Track ID"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* TrackLink */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Track Link</Typography>
                      <Controller
                        name="TrackLink"
                        {...register('TrackLink')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Track Link"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* LoadStatus */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Load Status</Typography>
                      <Controller
                        name="LoadStatus"
                        {...register('LoadStatus')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Load Status"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* LoadDate */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Load Date</Typography>
                      <Controller
                        name="LoadDate"
                        {...register('LoadDate')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Load Date"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* ChangeDate */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Change Date</Typography>
                      <Controller
                        name="ChangeDate"
                        {...register('ChangeDate')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Change Date"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* CreateSource */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Create Source</Typography>
                      <Controller
                        name="CreateSource"
                        {...register('CreateSource')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Create Source"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* DistanceFromDepotPlan */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Distance From Depot Plan</Typography>
                      <Controller
                        name="DistanceFromDepotPlan"
                        {...register('DistanceFromDepotPlan')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Distance From Depot Plan"
                            {...field}
                            fullWidth
                            type="number"
                          />
                        )}
                      />
                    </Grid>
                    {/* Pin */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Pin</Typography>
                      <Controller
                        name="Pin"
                        {...register('Pin')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Pin"
                            {...field}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    {/* CreateDateUtc */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Create Date UTC</Typography>
                      <Controller
                        name="CreateDateUtc"
                        {...register('CreateDateUtc')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Create Date UTC"
                            {...field}
                            fullWidth
                            type="datetime-local"
                          />
                        )}
                      />
                    </Grid>
                    {/* __v */}
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Version (__v)</Typography>
                      <Controller
                        name="__v"
                        {...register('__v')}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Version"
                            {...field}
                            fullWidth
                            type="number"
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
                  style={{ margin: '10px', width: '130px' }}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  className="custom-button"
                  style={{ margin: '10px', width: '130px' }}
                  startIcon={<CancelTwoToneIcon />}
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
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  csvOptions: {
                    fileName: 'selected_orders_export',
                    utf8WithBom: true,
                  },
                  printOptions: { disableToolbarButton: true },
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