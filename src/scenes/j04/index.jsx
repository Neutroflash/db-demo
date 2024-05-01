import { useEffect, useState } from "react";
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

const J04 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataContacts, setDataContacts] = useState([]);
  const [selectedRow, setSelectedRow] = useState({}); 
  const backendUrl = "http://localhost:3000/api/v1/j04";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => setDataContacts(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const columns = [
    { field: "j04", headerName: "j04", flex: 0.5 },
    { field: "j03", headerName: "j03" },
    { field: "cartnomold", headerName: "cartnomold", flex: 1 },
    {
      field: "cartref",
      headerName: "cartref",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "cartrif", headerName: "cartrif", flex: 1 },
    { field: "cartcoord", headerName: "cartcoord", flex: 1 },
    { field: "cartpag", headerName: "cartpag", flex: 1 },
    { field: "cartdescr", headerName: "cartdescr", flex: 1 },
    { field: "cartdata", headerName: "cartdata", flex: 1 },
    { field: "cartnote", headerName: "cartnote", flex: 1 },
  ];
  return (
    <Box m="20px">
      <Header title="J04_CARTELLE" subtitle="Data List of J04_cartelle" />
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
                  J04:{" "}
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
                 <Typography>Data: </Typography>
                 <Typography>Nominativo: </Typography>
                 <Typography>Old Name: </Typography>
                 </Box>
                 <Typography>Descrizione: </Typography>
                 <Typography>Note: </Typography>
                 <Typography>CartRef: </Typography>
                 <Typography>CartRif: </Typography>
                 <Typography>CartCoord: </Typography>
                 <Typography>CartPag: </Typography>  
            </Grid>
          </Grid>
        </Paper>
        <DataGrid
          getRowId={(row) => row.j04}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => {
            const selectedClick = params.row.j04;
            console.log("Selected Click:", selectedClick);
          }}
        />
      </Box>
    </Box>
  );
};

export default J04;
