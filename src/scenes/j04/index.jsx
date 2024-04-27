import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { j04 } from "../../data/mockData";
import Header from "../../components/Header";

const J04 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        <DataGrid
          getRowId={(row) => row.j04}
          rows={j04}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default J04;
