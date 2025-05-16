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
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

const VehiclesLayers = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowID, setRowID] = useState(0);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view', or 'edit'

  const fields = [
    'Id',
    'DriverId',
    'DriverUsername',
    'DepotId',
    'Depot',
    'Number',
    'Weight',
    'Volume',
    'Pallets',
  ];

  const defValues = {
    Id: '',
    DriverId: '',
    DriverUsername: '',
    DepotId: '',
    Depot: '',
    Number: '',
    Weight: 0,
    Volume: 0,
    Pallets: 0,
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
    fetch('https://trackpod-server.vercel.app/vehicle', {
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
      const postData = {
        Id: data.Id,
        DriverId: data.DriverId,
        DriverUsername: data.DriverUsername,
        DepotId: data.DepotId,
        Depot: data.Depot,
        Number: data.Number,
        Weight: data.Weight,
        Volume: data.Volume,
        Pallets: data.Pallets,
      };
      const apiUrl = 'https://trackpod-server.vercel.app/vehicle/add';

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
                swalContainer.style = 'z-index: 1500';
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
                swalContainer.style = 'z-index: 1500';
              }
            },
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else if (modalMode === 'edit') {
      const putData = {
        Id: data.Id,
        DriverId: data.DriverId,
        DriverUsername: data.DriverUsername,
        DepotId: data.DepotId,
        Depot: data.Depot,
        Number: data.Number,
        Weight: data.Weight,
        Volume: data.Volume,
        Pallets: data.Pallets,
      };
      const apiUrl = 'https://trackpod-server.vercel.app/vehicle/update';

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
                swalContainer.style = 'z-index: 1500';
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
                swalContainer.style = 'z-index: 1500';
              }
            },
          });
        })
        .finally(() => {
          setSubmitting(false);
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
      const response = await axios.get(
        `https://trackpod-server.vercel.app/vehicle?username=${encodedUsername}&_t=${Date.now()}`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      let vehicleData = response.data;
      console.log('Raw driver data from API:', vehicleData);

      if (Array.isArray(vehicleData)) {
        vehicleData = vehicleData.find(
          (driver) => driver.DriverUsername === username || driver.username === username
        );
        if (!vehicleData) {
          throw new Error(`No driver found with username: ${username}`);
        }
      } else if (!vehicleData || Object.keys(vehicleData).length === 0) {
        throw new Error('No driver data returned for username');
      }

      const normalizedData = {
        Id: vehicleData.Id || vehicleData.id || '',
        DriverId: vehicleData.DriverId || vehicleData.driverId || '',
        DriverUsername: vehicleData.DriverUsername || vehicleData.username || '',
        DepotId: vehicleData.DepotId || vehicleData.depotId || '',
        Depot: vehicleData.Depot || vehicleData.depot || '',
        Number: vehicleData.Number || vehicleData.number || '',
        Weight: vehicleData.Weight || vehicleData.weight || 0,
        Volume: vehicleData.Volume || vehicleData.volume || 0,
        Pallets: vehicleData.Pallets || vehicleData.pallets || 0,
      };

      console.log('Normalized driver data:', normalizedData);

      reset(defValues);
      console.log('Form state after reset:', getValues());

      Object.keys(normalizedData).forEach((key) => {
        setValue(key, normalizedData[key]);
      });

      console.log('Form values after setValue:', getValues());

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

  const handleEditRowClick = (row) => {
    if (!row || !row.Id) {
      console.error('Invalid row data:', row);
      Swal.fire({
        title: 'Error',
        text: 'Invalid record data',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    const normalizedData = {
      Id: row.Id || '',
      DriverId: row.DriverId || '',
      DriverUsername: row.DriverUsername || '',
      DepotId: row.DepotId || '',
      Depot: row.Depot || '',
      Number: row.Number || '',
      Weight: row.Weight || 0,
      Volume: row.Volume || 0,
      Pallets: row.Pallets || 0,
    };

    console.log('Normalized edit data:', normalizedData);

    reset(defValues);
    console.log('Form state after reset:', getValues());

    Object.keys(normalizedData).forEach((key) => {
      setValue(key, normalizedData[key]);
    });

    console.log('Form values after setValue:', getValues());

    setModalMode('edit');
    setOpen(true);
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

  const handleDeleteClick = async (id) => {
    if (!id) {
      console.error('Invalid ID:', id);
      Swal.fire({
        title: 'Error',
        text: 'Invalid record ID',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      willOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          swalContainer.style = 'z-index: 1500';
        }
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      console.log('Deleting record with ID:', id);
      const apiUrl = 'https://trackpod-server.vercel.app/vehicle/delete';
      await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'text/plain',
        },
        data: { Id: id },
      });

      setRefresh((prev) => !prev);
      Swal.fire({
        title: 'Deleted',
        text: 'Record deleted successfully',
        icon: 'success',
        timer: 1000,
        willOpen: () => {
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500';
          }
        },
      });
    } catch (error) {
      console.error('Error deleting record:', error, 'Response:', error.response?.data);
      let errorMessage = 'Failed to delete record';
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
        timer: 2000,
        willOpen: () => {
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style = 'z-index: 1500';
          }
        },
      });
    }
  };

  const columns = [
     {
      field: 'Id',
      headerName: 'Id',
      width: 100,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Number',
      headerName: 'Order #',
      width: 70,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DriverUsername',
      headerName: 'Username',
      width: 150,
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
      field: 'Depot',
      headerName: 'Depot',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DepotId',
      headerName: 'DepotId',
      width: 200,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Pallets',
      headerName: 'Pallets',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Volume',
      headerName: 'Volume',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Weight',
      headerName: 'Weight',
      width: 180,
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => handleEditRowClick(params.row)}
          sx={{ minWidth: 0 }}
        >
          <EditIcon color="primary" />
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => handleDeleteClick(params.row.Id)}
          sx={{ minWidth: 0 }}
        >
          <DeleteIcon color="error" />
        </Button>
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
                      <Typography sx={{ fontSize: '15px' }}>Username</Typography>
                      <Controller
                        name="DriverUsername"
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
                      <Typography sx={{ fontSize: '15px' }}>Driver Id</Typography>
                      <Controller
                        name="DriverId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter DriverId"
                            {...field}
                            fullWidth
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Pallets</Typography>
                      <Controller
                        name="Pallets"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Pallets"
                            {...field}
                            fullWidth
                            type="number"
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Volume</Typography>
                      <Controller
                        name="Volume"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Volume"
                            {...field}
                            fullWidth
                            type="number"
                            disabled={modalMode === 'view'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} sx={{ width: '385px' }}>
                      <Typography sx={{ fontSize: '15px' }}>Weight</Typography>
                      <Controller
                        name="Weight"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            placeholder="Enter Weight"
                            {...field}
                            fullWidth
                            type="number"
                            disabled={modalMode === 'view'}
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
              getRowId={(row) => row.Id}
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

export default VehiclesLayers;