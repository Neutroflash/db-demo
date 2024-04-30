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

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [dataContacts, setDataContacts] = useState([]);
  const backendUrl = "http://localhost:3000/api/v1/postgres";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => setDataContacts(data))
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                 <Typography sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  J01:{" "}
                  <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFBAAB",
                        minWidth: "40px",
                        minHeight: "40px",
                        display: "inline-block",
                        backgroundColor: "#FFD3D3",
                      }}
                    >
                      {selectedRow.j01 || ""}</Box>
                 </Typography>
                 <Typography>Ordine Cliente: </Typography>
                 <Typography>Titolo: </Typography>
                 <Typography>Note: </Typography>
                 </Box>
                 <Typography>Data-oridne: </Typography>
                 <Typography>Ordine-Imp IVA: </Typography>
                 <Typography>Cliente: </Typography>
                 <Typography>Cartella: </Typography>
                 <Typography>Link-ordine: </Typography>
                 <Typography>Avanzamento: </Typography>
                 <Typography>Ordine fatturato: </Typography>
                 <Typography>offerta: </Typography>     
            </Grid>
          </Grid>
        </Paper>
        <DataGrid
          getRowId={(row) => row.j01}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
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
