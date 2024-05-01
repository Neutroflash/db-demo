import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
  TextField,
  Select,
  Paper,
  Grid,
  MenuItem,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Checkbox from "@mui/material/Checkbox";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [dataContacts, setDataContacts] = useState([]);
  const [j04Options, setJ04Options] = useState([]);
  const [selectedJ01, setSelectedJ01] = useState("");

  const [j03Values, setJ03Values] = useState([]);
  const backendUrl = "http://localhost:3000/api/v1/postgres";
  const fecha = selectedRow.j1dat ? new Date(selectedRow.j1dat) : null;
  const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/j04`)
      .then((response) => response.json())
      .then((data) => {
        setJ04Options(data);
      })
      .catch((error) => console.error("Error fetching j04 options:", error));
  }, []);

  const fetchData = () => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => {
        setDataContacts(data);
        const uniqueJ03Values = [...new Set(data.map((row) => row.j03))];
        setJ03Values(uniqueJ03Values);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDeleteRow = (row) => {
    setRowData(row);
    setConfirmDeleteDialogOpen(true);
  };

  const handleEditRow = (row) => {
    setRowData(row);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCartelleChange = (value) => {
    // Buscar el registro en la tabla j01 que corresponde al valor seleccionado en j04
    const relatedJ01Row = dataContacts.find((row) => row.j04 === value);
  
    if (relatedJ01Row) {
      // Actualizar los campos de selectedRow basados en el registro encontrado
      setSelectedRow((prev) => ({
        ...prev,
        ...relatedJ01Row,
      }));
    }
  };

  const handleSaveRow = () => {
    if (editMode) {
      const updatedRows = dataContacts.map((r) =>
        r.j01 === rowData.j01 ? rowData : r
      );
      setDataContacts(updatedRows);
    } else {
      const newRow = { ...rowData };
      setDataContacts([...dataContacts, newRow]);
    }
    setOpenDialog(false);
  };

  const handleDeleteConfirmed = () => {
    fetch(`http://localhost:3000/api/v1/postgres/:id`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete record");
        }
        return response.json();
      })
      .then(() => {
        const updatedRows = dataContacts.filter((r) => r.j01 !== rowData.j01);
        setDataContacts(updatedRows);
        setOpenDialog(false);
        setConfirmDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
      });
  };

  const handleClientiChange = (value) => {
    const rowData = getRowDataByJ03(value);
    setSelectedRow((prev) => ({
      ...prev,
      j03: value,
      ...rowData,
    }));
  };

  const handleJ04Change = (value) => {
  // Buscar el registro en la tabla j01 que corresponde al valor seleccionado en j04
  const relatedJ01Row = dataContacts.find((row) => row.j04 === value);

  if (relatedJ01Row) {
    // Actualizar los campos de selectedRow basados en el registro encontrado
    setSelectedRow((prev) => ({
      ...prev,
      ...relatedJ01Row,
    }));
  }
};

  const getRowDataByJ03 = (j03Value) => {
    const selectedRow = dataContacts.find((row) => row.j03 === j03Value);
    return selectedRow ? selectedRow : {};
  };
  

  const columns = [
    { field: "j01", headerName: "j01", flex: 0.5 },
    { field: "j03", headerName: "j03" },
    {
      field: "j04",
      headerName: "j04",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "j1impiva",
      headerName: "j1impiva",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "j1rif_offer",
      headerName: "j1rif_offer",
      flex: 1,
    },
    {
      field: "j1rif_client",
      headerName: "j1rif_client",
      flex: 1,
    },
    {
      field: "j1dat",
      headerName: "j1dat",
      flex: 1,
    },
    {
      field: "j1titol",
      headerName: "j1titol",
      flex: 1,
    },
    {
      field: "j1note",
      headerName: "j1note",
      flex: 1,
    },
    {
      field: "j1fat_1",
      headerName: "j1fat_1",
      flex: 1,
    },
    {
      field: "j1fat_1_rif",
      headerName: "j1fat_1_rif",
      flex: 1,
    },
    {
      field: "j1fat_2",
      headerName: "j1fat_2",
      flex: 1,
    },
    {
      field: "j1fat_2_rif",
      headerName: "j1fat_2_rif",
      flex: 1,
    },
    {
      field: "j1fat_3",
      headerName: "j1fat_3",
      flex: 1,
    },
    {
      field: "j1fat_3_rif",
      headerName: "j1fat_3_rif",
      flex: 1,
    },
    {
      field: "j1tot_fat",
      headerName: "j1tot_fat",
      flex: 1,
    },
    {
      field: "sel",
      headerName: "sel",
      flex: 1,
    },
    {
      field: "link_ordine",
      headerName: "link_ordine",
      flex: 1,
    },
    {
      field: "j1_avanz",
      headerName: "j1_avanz",
      flex: 1,
    },
    {
      field: "j1_av_data",
      headerName: "j1_av_data",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column">
          <Button size="small" onClick={() => handleEditRow(params.row)}>
            Edit
          </Button>
          <Button size="small" onClick={() => handleDeleteRow(params.row)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="J01_COMM" subtitle="Data List of J01_COMM" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.redAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.redAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={3}
              sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
            >
              {/* J01 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  J01:
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "70px",
                      minHeight: "20px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "12px",
                    }}
                  >
                    {selectedRow.j01 || ""}
                  </Box>
                </Typography>
                {/* Ordine Cliente */}
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Ordine Cliente:{" "}
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "170px",
                      minHeight: "20px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "11px",
                    }}
                  >
                    {selectedRow.j1rif_client || ""}
                  </Box>{" "}
                </Typography>
              </Box>
              {/* Titolo */}
              <Box>
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "1px" }}
                >
                  Titolo:
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "90%",
                      minHeight: "20px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "12px",
                    }}
                  >
                    {selectedRow.j1titol || ""}
                  </Box>{" "}
                </Typography>
              </Box>
              {/* Note */}
              <Box>
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Note:
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "90%",
                      minHeight: "90px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "13px",
                    }}
                  >
                    {selectedRow.j1note || ""}
                  </Box>
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Data-ordine */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Data-ordine:{" "}
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "70px",
                      minHeight: "20px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "10px",
                    }}
                  >
                    {fechaFormateada ? fechaFormateada : ""}
                  </Box>
                </Typography>
                {/* Ordine-Imp IVA */}
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Ordine-Imp IVA:
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#FFBAAB",
                      minWidth: "70px",
                      minHeight: "20px",
                      display: "inline-block",
                      backgroundColor: "#FFD3D3",
                      fontSize: "12px",
                    }}
                  >
                    {selectedRow.j1impiva || ""}
                  </Box>{" "}
                </Typography>
              </Box>
              {/* Clienti */}
              <Box>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Clienti:
                  <Select
                    value={selectedRow.j03 || ""}
                    onChange={(e) => handleClientiChange(e.target.value)}
                    sx={{
                      minWidth: "300px",
                      fontSize: "12px",
                      backgroundColor: "#FBFF80",
                    }}
                  >
                    {j03Values.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </Typography>
              </Box>
              {/* Cartella */}
              <Box>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Cartella:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#C9FFB5",
                        minWidth: "70px",
                        minHeight: "50px",
                        display: "inline-block",
                        backgroundColor: "#C9FFB5",
                        fontSize: "12px",
                      }}
                    >
                      {selectedRow.j04 || ""}
                    </Box>
                    <Select
                      value={selectedRow.j04 || ""}
                      onChange={(e) => {
                        handleJ04Change(e.target.value); // Aquí se llama a handleJ04Change
                      }}
                      sx={{ minWidth: "50%", fontSize: "12px", background: "#C9FFB5" }}
                    >
                      {j04Options.map((option) => (
                        <MenuItem key={option.j04} value={option.j04}>
                          {option.cartdescr}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Link-ordine */}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                Link-ordine:{" "}
                <Box
                  component="span"
                  sx={{
                    border: 1,
                    padding: 1,
                    borderRadius: "5px",
                    borderColor: "#FFBAAB",
                    minWidth: "70px",
                    minHeight: "20px",
                    display: "inline-block",
                    backgroundColor: "#FFD3D3",
                    fontSize: "10px",
                  }}
                >
                  {selectedRow.link_ordine || ""}
                </Box>
              </Typography>
              {/* Avanzamento */}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                Avanzamento:{" "}
                <Box
                  component="span"
                  sx={{
                    border: 1,
                    padding: 1,
                    borderRadius: "5px",
                    borderColor: "#FFBAAB",
                    minWidth: "70px",
                    minHeight: "20px",
                    display: "inline-block",
                    backgroundColor: "#FFD3D3",
                    fontSize: "10px",
                  }}
                >
                  {selectedRow.j1_avanz}
                </Box>
              </Typography>

              {/* offerta */}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: "30px",
                }}
              >
                offerta:{" "}
                <Box
                  component="span"
                  sx={{
                    border: 1,
                    padding: 1,
                    borderRadius: "5px",
                    borderColor: "#FFBAAB",
                    minWidth: "70px",
                    minHeight: "20px",
                    display: "inline-block",
                    backgroundColor: "#FFD3D3",
                    fontSize: "10px",
                  }}
                >
                  {selectedRow.j1rif_offer}
                </Box>
              </Typography>
              {/* Ordine fatturato */}
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {" "}
                Ordine fatturato:{" "}
                <Checkbox
                  checked={selectedRow.sel}
                  disabled
                  color="primary"
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <DataGrid
          getRowId={(row) => row.j01}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => {
            const selectedJ01 = params.row.j01;
            setSelectedJ01(selectedJ01);
            console.log("Selected J01:", selectedJ01);
            setSelectedRow(params.row);
          }}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Edit Record" : "Add Record"}</DialogTitle>
        <DialogContent sx={{ minHeight: "200px", maxHeight: "75vh" }}>
          <Box>
            {columns.map((column) => (
              <Box key={column.field} mb={2} display="flex" alignItems="center">
                <Box minWidth="120px">{column.headerName}:</Box>
                <Box flexGrow={1}>
                  {column.field === "j03" ? (
                    <Select
                      fullWidth
                      value={rowData.j03 || ""}
                      onChange={(e) =>
                        setRowData({ ...rowData, j03: e.target.value })
                      }
                      style={{ width: "100%" }}
                    ></Select>
                  ) : column.field === "j04" ? (
                    <Select
                      fullWidth
                      value={rowData.j04 || ""}
                      onChange={(e) =>
                        setRowData({ ...rowData, j04: e.target.value })
                      }
                      style={{ width: "100%" }}
                    ></Select>
                  ) : (
                    <TextField
                      fullWidth
                      value={rowData[column.field] || ""}
                      onChange={(e) =>
                        setRowData({
                          ...rowData,
                          [column.field]: e.target.value,
                        })
                      }
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRow}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>{`Delete Record ${rowData.j01}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteConfirmed();
              setConfirmDeleteDialogOpen(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
