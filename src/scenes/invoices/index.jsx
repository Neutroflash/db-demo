import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const backendUrl = "http://localhost:3000/api/v1/j03";
  const [dataContacts, setDataContacts] = useState([]);

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
    { field: "j03", headerName: "j03", flex: 0.5 },
    { field: "nomin", headerName: "nomin" },
    { field: "plva", headerName: "plva", flex: 1 },
    {
      field: "cfisc",
      headerName: "cfisc",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "nomcitta", headerName: "nomcitta", flex: 1 },
    { field: "nomcap", headerName: "nomcap", flex: 1 },
    { field: "nomindirizzo", headerName: "nomindirizzo", flex: 1 },
    { field: "nomprov", headerName: "nomprov", flex: 1 },
    { field: "nomnote", headerName: "nomnote", flex: 1 },
    { field: "codident", headerName: "codident", flex: 1 },
    { field: "pec", headerName: "pec", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="J03_NOMIN_CARTELLE"
        subtitle="Data List of J03_NOMIN_CARTELLE"
      />
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
          getRowId={(row) => row.j03}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
