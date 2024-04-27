import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [dataContacts, setDataContacts] = useState(mockDataContacts); // Inicializa dataContacts con mockDataContacts

  const handleDeleteRow = (row) => {
    setRowData(row);
    setConfirmDeleteDialogOpen(true);
  };

  const handleAddRow = () => {
    setRowData({});
    setEditMode(false);
    setOpenDialog(true);
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

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleDeleteConfirmed = () => {
    const updatedRows = dataContacts.filter((r) => r.j01 !== rowData.j01);
    setDataContacts(updatedRows);
    setOpenDialog(false);
    setConfirmDeleteDialogOpen(false);
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

  const j03Options = Array.from(
    new Set(mockDataContacts.map((row) => row.j03))
  );
  const j04Options = Array.from(
    new Set(mockDataContacts.map((row) => row.j04))
  );

  return (
    <Box m="20px">
      <Header title="J01_COMM" subtitle="Data List of J01_COMM" />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mb="20px"
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb="20px"
        >
          <Button variant="contained" size="small" onClick={handleAddRow}>
            Add Row
          </Button>
        </Box>
      </Box>
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
                    >
                      {j03Options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : column.field === "j04" ? (
                    <Select
                      fullWidth
                      value={rowData.j04 || ""}
                      onChange={(e) =>
                        setRowData({ ...rowData, j04: e.target.value })
                      }
                      style={{ width: "100%" }}
                    >
                      {j04Options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
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
