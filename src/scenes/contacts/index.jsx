import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { j02 } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "j02", headerName: "j02", flex: 0.5 },
    { field: "j2num", headerName: "j2num" },
    { field: "j2dat", headerName: "j2dat", flex: 1 },
    {
      field: "j01",
      headerName: "j01",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "j03", headerName: "j03", flex: 1 },
    { field: "j04", headerName: "j04", flex: 1 },
    { field: "j2preset", headerName: "j2preset", flex: 1 },
    { field: "j2imp", headerName: "j2imp", flex: 1 },
    { field: "j2pcnpaia", headerName: "j2pcnpaia", flex: 1 },
    { field: "j2cnpaia", headerName: "j2cnpaia", flex: 1 },
    { field: "j2impiva", headerName: "j2impiva", flex: 1 },
    { field: "j2piva", headerName: "j2piva", flex: 1 },
    { field: "j2iva", headerName: "j2iva", flex: 1 },
    { field: "j2tot", headerName: "j2tot", flex: 1 },
    { field: "j2note", headerName: "j2note", flex: 1 },
    { field: "j2_data_saldo", headerName: "j2_data_saldo", flex: 1 },
    { field: "pag_saldo", headerName: "pag_saldo", flex: 1 },
    { field: "j2_incas_1", headerName: "j2_incas_1", flex: 1 },
    { field: "j2_incas_2", headerName: "j2_incas_2", flex: 1 },
    { field: "j2_incas_3", headerName: "j2_incas_3", flex: 1 },
    { field: "j2_incassato", headerName: "j2_incassato", flex: 1 },
    { field: "j2_da_incassare", headerName: "j2_da_incassare", flex: 1 },
    { field: "ordid", headerName: "ordid", flex: 1 },
    { field: "j2_dat_inc_1", headerName: "j2_dat_inc_1", flex: 1 },
    { field: "j2_dat_inc_2", headerName: "j2_dat_inc_2", flex: 1 },
    { field: "j2_dat_pag_contr", headerName: "j2_dat_pag_contr", flex: 1 },
    { field: "previs", headerName: "previs", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="J02_FAT"
        subtitle="Data List of J02_FAT"
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
          getRowId={(row) => row.j02}
          rows={j02}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
