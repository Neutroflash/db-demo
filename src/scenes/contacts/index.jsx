import { useEffect, useState } from "react";
import { Box, Paper, Typography, Select, MenuItem, Grid } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataContacts, setDataContacts] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [selectedJ04, setSelectedJ04] = useState("");
  const [selectedJ03, setSelectedJ03] = useState({});
  const [selectedJ02, setSelectedJ02] = useState(null);
  const [dataJ03, setDataJ03] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/api/v1/j02")
      .then((response) => response.json())
      .then((data) => setDataContacts(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchJ03Data = (selectedId, selectedJ03) => {
    fetch(
      `http://localhost:3000/api/v1/j03?j02=${selectedId}&j03=${selectedJ03}`
    )
      .then((response) => response.json())
      .then((data) => {
        setDataJ03(data);
        const selectedJ03Data =
          data.find((row) => row.j03 === selectedJ03) || {};
        setSelectedJ03(selectedJ03Data);
      })
      .catch((error) => console.error("Error fetching J03 data:", error));
  };

  const handleJ03Change = (event) => {
    const selectedNomin = event.target.value;
    setSelectedJ03({ nomin: selectedNomin });

    // Encuentra el id j03 correspondiente
    const selectedJ03Id =
      dataJ03.find((row) => row.nomin === selectedNomin)?.j03 || "";

    // Realiza una solicitud al backend para obtener los datos de j02 relacionados con el id j03
    fetch(`http://localhost:3000/api/v1/j02?j03=${selectedJ03Id}`)
      .then((response) => response.json())
      .then((data) => {
        // Actualiza los datos de j02
        setDataContacts(data);

        // Actualiza el selector j02
        setSelectedId(selectedJ03Id);

        // Encuentra la fila seleccionada en los nuevos datos de j02
        const selectedRow = data.find((row) => row.j02 === selectedJ03Id) || {};
        setSelectedRow(selectedRow);

        // Actualiza otros datos relacionados con j02
        setSelectedJ04(selectedRow.j04 || "");

        // Actualiza los datos de j03
        const selectedJ03Data =
          dataJ03.find((row) => row.nomin === selectedNomin) || {};
        setSelectedJ03(selectedJ03Data);
      })
      .catch((error) => console.error("Error fetching J02 data:", error));
  };

  const handleIdChange = (event) => {
    const selectedJ02 = event.target.value;
    setSelectedId(selectedJ02);
    setSelectedRow(dataContacts.find((row) => row.j02 === selectedJ02) || {});
    setSelectedJ04(
      dataContacts.find((row) => row.j02 === selectedJ02)?.j04 || ""
    );

    const selectedJ03 =
      dataContacts.find((row) => row.j02 === selectedJ02)?.j03 || "";
    fetchJ03Data(selectedJ02, selectedJ03);
  };

  const handleJ04Change = (event) => {
    const selectedJ04 = event.target.value;
    setSelectedJ04(selectedJ04);

    const selectedRow =
      dataContacts.find((row) => row.j04 === selectedJ04) || {};
    setSelectedRow(selectedRow);

    const selectedJ02 = selectedRow.j02 || "";
    setSelectedId(selectedJ02);

    const selectedJ03 = selectedRow.j03 || "";
    fetchJ03Data(selectedJ02, selectedJ03);
  };

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
      <Header title="J02_FAT" subtitle="Data List of J02_FAT" />
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h4">
              INVOICE DETAILS
            </Typography>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="expand"
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                  <Typography>
                    J02:
                    <Select
                      variant="outlined"
                      value={selectedId}
                      onChange={handleIdChange}
                      fullWidth
                      style={{ marginLeft: "10px" }}
                      sx={{ width: "75px" }}
                    >
                      {dataContacts.map((row) => (
                        <MenuItem key={row.j02} value={row.j02}>
                          {row.j02}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
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
                      {selectedRow.j01 || ""}
                    </Box>
                  </Typography>
                  <Typography>
                    J04:
                    <Select
                      variant="outlined"
                      value={selectedJ04}
                      onChange={handleJ04Change}
                      fullWidth
                      style={{ marginLeft: "10px" }}
                      sx={{ width: "74px", backgroundColor: "#D3FFEE" }}
                    >
                      {dataContacts.map((row) => (
                        <MenuItem key={row.j04} value={row.j04}>
                          {row.j04}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    Num. Fattura:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "40px",
                        minHeight: "40px",
                        display: "inline-block",
                        backgroundColor: "#E2E8FF",
                        marginLeft: "8px",
                      }}
                    >
                      {" "}
                      {selectedRow.j2num || ""}{" "}
                    </Box>
                  </Typography>

                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    Data:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "40px",
                        minHeight: "40px",
                        display: "inline-block",
                        backgroundColor: "#E2E8FF",
                        marginLeft: "8px",
                      }}
                    >
                      {" "}
                      {selectedRow.j2dat || ""}
                    </Box>
                  </Typography>
                </Box>
                <Box
                  component="span"
                  sx={{
                    border: 1,
                    padding: 1,
                    borderRadius: "5px",
                    borderColor: "#ABBEFF",
                    minHeight: "200px",
                    backgroundColor: "#E2E8FF",
                  }}
                >
                  <Typography>{selectedRow.j2preset || ""}</Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#CECECE",
                      minHeight: "90px",
                    }}
                  >
                    <Typography>{selectedRow.j2note || ""}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5px",
                  }}
                >
                  <Typography>J2Imp:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2imp || ""}
                  </Box>

                  <Typography>J2%cnpaia:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2pcnpaia || ""}
                  </Box>

                  <Typography>J2Cnp aia:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2cnpaia || ""}
                  </Box>

                  <Typography>J2ImpIva:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2impiva || ""}
                  </Box>

                  <Typography>J2%iva:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2piva || ""}
                  </Box>

                  <Typography>J2Iva:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2iva || ""}
                  </Box>

                  <Typography>J2Tot:</Typography>
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#ABBEFF",
                      minWidth: "80px",
                      minHeight: "10px",
                      display: "inline-block",
                      backgroundColor: "#E2E8FF",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedRow.j2tot || ""}
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <Box>
                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    J03:{" "}
                    <Select
                      variant="outlined"
                      value={selectedJ03.nomin || ""}
                      onChange={handleJ03Change}
                      fullWidth
                      style={{ marginLeft: "10px", backgroundColor: "#FBFF80" }}
                    >
                      {dataJ03.map((row) => (
                        <MenuItem key={row.nomin} value={row.nomin}>
                          {row.nomin}
                        </MenuItem>
                      ))}
                    </Select>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Part. Iva:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.plva || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Cod. Fisc:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.cfisc || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    NomIndirizzo:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.nomindirizzo || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Num CAP:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.nomcap || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Provincia:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedRow.nomprov || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Citta:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#ABBEFF",
                        minWidth: "70px",
                        minHeight: "20px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.nomcitta || ""}
                    </Box>
                  </Typography>
                </Box>
                <Box>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-1:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_incas_1 || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-2:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_incas_2 || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-3:
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {" "}
                          {selectedRow.j2_incas_3 || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat inc-1:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_dat_inc_1 || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat inc-2:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_dat_inc_2 || ""}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat saldo:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_data_saldo || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incassato:
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_incassato || ""}{" "}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat pag contr:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_dat_pag_contr || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-da incassare:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_da_incassare || ""}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        pag-saldo:{" "}
                        <Box
                          component="span"
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#DCDCDC",
                            minWidth: "70px",
                            minHeight: "1 0px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.pag_Saldo || ""}
                        </Box>
                      </Typography>
                      <Typography>
                        previs: {selectedRow.previs || ""}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
        <DataGrid
          getRowId={(row) => row.j02}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(event, row) => {
            setSelectedJ02(row.j02);
          }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
