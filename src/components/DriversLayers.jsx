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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const DriversLayers = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowID, setRowID] = useState(0);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', or 'edit'

  const fields = [
    'id',
    'Active',
    'Depot',
    'DepotId',
    'HomeAddress',
    'Name',
    'Number',
    'Phone',
    'Username',
    'Vehicle',
    'Zone',
  ];

  const defValues = {
    _id: '',
    Id: '',
    Number: '',
    Active: false,
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
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    defaultValues: defValues,
  });

  useEffect(() => {
    fetch('http://trackpod-server.vercel.app/drivers', {
      headers: {
        accept: 'text/plain',
        'X-API-KEY': '0c340847-b764-4ff8-9250-0bb089486648',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          console.log('Orders loaded:', data);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch drivers list',
          icon: 'error',
          timer: 2000,
        });
      });
  }, [refresh]);

  const handleRowSelection = (newSelection) => {
    console.log('Selected rows:', newSelection);
    setSelectedRows(newSelection);
  };

  const onSubmit = (data) => {
    setSubmitting(true);
    const headers = {
      'Content-Type': 'application/json',
      accept: 'text/plain',
    };

    if (modalMode === 'add') {
      // Add driver
      const postData = {
        Number: data.Number,
        Name: data.Name,
        Username: data.Username,
        HomeAddress: data.HomeAddress,
        Vehicle: data.Vehicle,
        DepotId: data.DepotId,
        Depot: data.Depot,
        Zone: data.Zone,
        Phone: data.Phone,
        Active: data.Active,
      };
      const apiUrl = 'http://trackpod-server.vercel.app/drivers111/add';

      axios
        .post(apiUrl, postData, { headers })
        .then((response) => {
          setRefresh((prev) => !prev);
          setOpen(false);
          reset(defValues);
          setRowID(0);
          setModalMode('add');
          Swal.fire({
            title: 'Driver Added',
            text: 'Driver added successfully',
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
          console.error('Error adding Driver:', error);
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'Failed to add Driver',
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
    } else if (modalMode === 'edit') {
      // Update driver
      const putData = {
        _id: data._id,
        Id: data.Id,
        Number: data.Number,
        Name: data.Name,
        Username: data.Username,
        HomeAddress: data.HomeAddress,
        Vehicle: data.Vehicle,
        DepotId: data.DepotId,
        Depot: data.Depot,
        Zone: data.Zone,
        Phone: data.Phone,
        Active: data.Active,
      };
      const apiUrl = 'http://trackpod-server.vercel.app/drivers/update';

      axios
        .put(apiUrl, putData, { headers })
        .then((response) => {
          setRefresh((prev) => !prev);
          setOpen(false);
          reset(defValues);
          setRowID(0);
          setModalMode('add');
          Swal.fire({
            title: 'Driver Updated',
            text: 'Driver updated successfully',
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
          console.error('Error updating Driver:', error);
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'Failed to update Driver',
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
    }
  };

  const handleNumberClick = async (rowId, mode = 'view') => {
    if (!rowId) {
      console.error('Invalid rowId:', rowId);
      Swal.fire({
        title: 'Error',
        text: 'Invalid driver ID',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    try {
      const encodedId = encodeURIComponent(rowId);
      console.log('Fetching driver with Id:', rowId, 'Encoded:', encodedId);
      const response = await axios.get(`http://trackpod-server.vercel.app/drivers/${encodedId}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      const driverData = response.data;
      console.log('Driver data from new API (Id):', driverData);

      // Reset form before setting new values
      reset(defValues);

      // Set form values with fetched data
      setValue('_id', driverData._id || '');
      setValue('Id', driverData.Id || driverData.id || '');
      setValue('Number', driverData.number || driverData.Number || driverData.id || '');
      setValue('Name', driverData.Name || '');
      setValue('Username', driverData.Username || '');
      setValue('HomeAddress', driverData.HomeAddress || '');
      setValue('Vehicle', driverData.Vehicle || '');
      setValue('DepotId', driverData.DepotId || '');
      setValue('Depot', driverData.Depot || '');
      setValue('Zone', driverData.Zone || '');
      setValue('Phone', driverData.Phone || '');
      setValue('Active', driverData.Active || false);

      // Open modal in specified mode
      setModalMode(mode);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching driver by Id:', error, 'Response:', error.response?.data);
      let errorMessage = 'Failed to fetch driver data';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure the server is running at 192.168.100.94:9001.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 4000,
      });
    }
  };

  const handleUsernameClick = async (username) => {
    if (!username) {
      console.error('Invalid username:', username);
      Swal.fire({
        title: 'Error',
        text: 'Invalid driver username',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    try {
      const encodedUsername = encodeURIComponent(username);
      console.log('Fetching driver with Username:', username, 'Encoded:', encodedUsername);
      const response = await axios.get(`http://trackpod-server.vercel.app/drivers?username=${encodedUsername}&_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
      });

      let driverData = response.data;
      console.log('Raw driver data from new API (Username):', driverData);

      // Handle array or single object
      if (Array.isArray(driverData)) {
        driverData = driverData.find(driver => driver.Username === username || driver.username === username);
        if (!driverData) {
          throw new Error(`No driver found with username: ${username}`);
        }
      } else if (!driverData || Object.keys(driverData).length === 0) {
        throw new Error('No driver data returned for username');
      }

      // Normalize field names
      const normalizedData = {
        _id: driverData._id || '',
        Id: driverData.Id || driverData.id || '',
        Number: driverData.number || driverData.Number || driverData.id || '',
        Name: driverData.name || driverData.Name || '',
        Username: driverData.username || driverData.Username || '',
        HomeAddress: driverData.homeAddress || driverData.HomeAddress || driverData.address || '',
        Vehicle: driverData.vehicle || driverData.Vehicle || '',
        DepotId: driverData.depotId || driverData.DepotId || driverData.depot_id || '',
        Depot: driverData.depot || driverData.Depot || '',
        Zone: driverData.zone || driverData.Zone || '',
        Phone: driverData.phone || driverData.Phone || '',
        Active: driverData.active || driverData.Active || false,
      };

      console.log('Normalized driver data (Username):', normalizedData);

      // Reset form before setting new values
      reset(defValues);
      console.log('Form state after reset:', getValues());

      // Set form values with normalized data
      setValue('_id', normalizedData._id);
      setValue('Id', normalizedData.Id);
      setValue('Number', normalizedData.Number);
      setValue('Name', normalizedData.Name);
      setValue('Username', normalizedData.Username);
      setValue('HomeAddress', normalizedData.HomeAddress);
      setValue('Vehicle', normalizedData.Vehicle);
      setValue('DepotId', normalizedData.DepotId);
      setValue('Depot', normalizedData.Depot);
      setValue('Zone', normalizedData.Zone);
      setValue('Phone', normalizedData.Phone);
      setValue('Active', normalizedData.Active);

      // Open modal in view mode
      setModalMode('view');
      setOpen(true);
    } catch (error) {
      console.error('Error fetching driver by Username:', error, 'Response:', error.response?.data);
      let errorMessage = 'Failed to fetch driver data';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure the server is running at 192.168.100.94:9001.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 4000,
      });
    }
  };

  const handleDeleteClick = async (driverId, driverName) => {
    if (!driverId) {
      console.error('Invalid driverId:', driverId);
      Swal.fire({
        title: 'Error',
        text: 'Invalid driver ID',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete driver "${driverName}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      willOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          swalContainer.style = 'z-index: 1500;';
        }
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const encodedId = encodeURIComponent(driverId);
      console.log('Deleting driver with ID:', driverId, 'Encoded:', encodedId);
      await axios.delete(`http://trackpod-server.vercel.app/drivers/delete/${encodedId}`, {
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      });

      setRefresh((prev) => !prev);
      Swal.fire({
        title: 'Driver Deleted',
        text: `Driver "${driverName}" deleted successfully`,
        icon: 'success',
        timer: 1000,
        willOpen: () => {
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500;';
          }
        },
      });
    } catch (error) {
      console.error('Error deleting driver:', error, 'Response:', error.response?.data);
      let errorMessage = 'Failed to delete driver';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure the server is running at localhost:3000.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
      } else {
        errorMessage = error.message;
      }
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 4000,
        willOpen: () => {
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500;';
          }
        },
      });
    }
  };

  const handleClickOpen = () => {
    setModalMode('add');
    reset(defValues);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset(defValues);
    setRowID(0);
    setModalMode('add');
  };

  const handleEditClick = () => {
    setModalMode('edit');
  };

  const columns = [
    {
      field: 'Number',
      headerName: 'Order #',
      width: 70,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => {
        console.log('Row data:', params.row);
        return (
          <Button
            variant="text"
            onClick={() => handleNumberClick(params.row.Id, 'view')}
            sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
          >
            {params.value || 'N/A'}
          </Button>
        );
      },
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
      renderCell: (params) => {
        console.log('Row data for Username:', params.row);
        return (
          <Button
            variant="text"
            onClick={() => handleUsernameClick(params.value)}
            sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
          >
            {params.value || 'N/A'}
          </Button>
        );
      },
    },
    {
      field: 'HomeAddress',
      headerName: 'Address',
      width: 150,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Vehicle',
      headerName: 'Vehicle',
      width: 150,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DepotId',
      headerName: 'Depot Id',
      width: 150,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Depot',
      headerName: 'Depot',
      width: 150,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Zone',
      headerName: 'Zone',
      width: 150,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      sortable: false,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleNumberClick(params.row.Id, 'edit')}
          title={`Edit ${params.row.Name}`}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      sortable: false,
      filterable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row._id, params.row.Name)}
          title={`Delete ${params.row.Name}`}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Card className="card" style={{ marginTop: '30px' }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h6">Driver</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
                  {modalMode === 'add' ? 'Add Driver' : modalMode === 'edit' ? 'Edit Driver' : 'View Driver'}
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: '#ff4d4f', marginTop: '-20px' }}>
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
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Name"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Username</Typography>
                      <Controller
                        name="Username"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Username"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Number</Typography>
                      <Controller
                        name="Number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Number"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Depot</Typography>
                      <Controller
                        name="Depot"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Depot"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>DepotId</Typography>
                      <Controller
                        name="DepotId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter DepotId"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Address</Typography>
                      <Controller
                        name="HomeAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Address"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Phone</Typography>
                      <Controller
                        name="Phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Phone"
                            {...field}
                            fullWidth
                            type="number"
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Vehicle</Typography>
                      <Controller
                        name="Vehicle"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Vehicle"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Zone</Typography>
                      <Controller
                        name="Zone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Zone"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Active</Typography>
                      <Controller
                        name="Active"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                disabled={modalMode === 'view'}
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
                {modalMode === 'add' && (
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    className="custom-button"
                    style={{ margin: '10px', width: '130px' }}
                    startIcon={<SaveIcon />}
                    disabled={submitting}
                  >
                    Save
                  </Button>
                )}
                {modalMode === 'view' && (
                  <Button
                    onClick={handleEditClick}
                    variant="contained"
                    className="custom-button"
                    style={{ margin: '10px', width: '130px' }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                )}
                {modalMode === 'edit' && (
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    className="custom-button"
                    style={{ margin: '10px', width: '130px' }}
                    startIcon={<SaveIcon />}
                    disabled={submitting}
                  >
                    Save
                  </Button>
                )}
                <Button
                  onClick={handleClose}
                  variant="contained"
                  className="custom-button"
                  style={{ margin: '10px', width: '130px' }}
                >
                  {modalMode === 'add' || modalMode === 'edit' ? 'Cancel' : 'Close'}
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

export default DriversLayers;