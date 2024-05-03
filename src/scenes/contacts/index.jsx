import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataContacts, setDataContacts] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [selectedJ04, setSelectedJ04] = useState("");
  const [selectedJ03, setSelectedJ03] = useState({});
  const [selectedJ02Click, setSelectedJ02Click] = useState(null);
  const [dataJ03, setDataJ03] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(selectedRow);
  const fecha = selectedRow.j2dat ? new Date(selectedRow.j2dat) : null;
  const fecha2 = selectedRow.j2_data_saldo
    ? new Date(selectedRow.j2_data_saldo)
    : null;
  const fecha3 = selectedRow.j2_dat_pag_contr
    ? new Date(selectedRow.j2_dat_pag_contr)
    : null;
  const fecha4 = selectedRow.j2_dat_inc_1
    ? new Date(selectedRow.j2_dat_inc_1)
    : null;
  const fecha5 = selectedRow.j2_dat_inc_2
    ? new Date(selectedRow.j2_dat_inc_2)
    : null;
  const fechaformat2 = fecha2 ? fecha2.toISOString().split("T")[0] : "";
  const fechaformat3 = fecha3 ? fecha3.toISOString().split("T")[0] : "";
  const fechaformat4 = fecha4 ? fecha4.toISOString().split("T")[0] : "";
  const fechaformat5 = fecha5 ? fecha5.toISOString().split("T")[0] : "";
  const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";
  const handleExpandClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

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

  const handleFieldChange = (field, value) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    // Realizar los cálculos necesarios
    const j2imp = parseFloat(selectedRow.j2imp);
    const j2pcnpaia = parseFloat(selectedRow.j2pcnpaia);
    const j2piva = parseFloat(selectedRow.j2piva);

    const j2cnpaia = j2imp * j2pcnpaia;
    const j2impiva = j2cnpaia + j2imp;
    const j2iva = j2impiva * j2piva;
    const j2tot = j2imp + j2iva + j2cnpaia;

    // Calcular j2_incassato
    const j2_incassato =
      parseFloat(selectedRow.j2_incas_1) +
      parseFloat(selectedRow.j2_incas_2) +
      parseFloat(selectedRow.j2_incas_3);

    // Calcular j2_da_incassare
    const j2_da_incassare = j2tot - j2_incassato;

    // Construir el objeto con los datos actualizados, incluyendo los resultados de los cálculos
    const updatedData = {
      ...selectedRow, // Mantener los valores anteriores
      j2imp: j2imp.toFixed(2),
      j2pcnpaia: j2pcnpaia.toFixed(2),
      j2cnpaia: j2cnpaia.toFixed(2),
      j2impiva: j2impiva.toFixed(2),
      j2piva: j2piva.toFixed(2),
      j2iva: j2iva.toFixed(2),
      j2tot: j2tot.toFixed(2),
      j2_incassato: j2_incassato.toFixed(2),
      j2_da_incassare: j2_da_incassare.toFixed(2),
    };

    // Realizar la petición PUT para actualizar los datos en la API
    fetch(`http://localhost:3000/api/v1/j02/${selectedRow.j02}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar los datos");
        }
        // Actualizar el estado de los datos con los cambios realizados
        const updatedList = dataContacts.map((item) =>
          item.j02 === selectedRow.j02 ? updatedData : item
        );
        setDataContacts(updatedList);
        setIsEditing(false); // Deshabilitar el modo de edición

        // Actualizar el estado local de los datos de la factura
        setSelectedRow(updatedData);
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

  const columns = [
    { field: "j02", headerName: "j02", flex: 0.2 },
    { field: "j2num", headerName: "j2num", flex: 0.2 },
    { field: "j2dat", headerName: "j2dat", flex: 3 },
    {
      field: "j01",
      headerName: "j01",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.2,
    },
    { field: "j03", headerName: "j03", flex: 0.1 },
    { field: "j04", headerName: "j04", flex: 1 },
    { field: "j2preset", headerName: "j2preset", flex: 5 },
    { field: "j2imp", headerName: "j2imp", flex: 1.3 },
    { field: "j2pcnpaia", headerName: "j2pcnpaia", flex: 1 },
    { field: "j2cnpaia", headerName: "j2cnpaia", flex: 1.2 },
    { field: "j2impiva", headerName: "j2impiva", flex: 1.3 },
    { field: "j2piva", headerName: "j2piva", flex: 0.3 },
    { field: "j2iva", headerName: "j2iva", flex: 1.3 },
    { field: "j2tot", headerName: "j2tot", flex: 1.3 },
    { field: "j2note", headerName: "j2note", flex: 2 },
    { field: "j2_data_saldo", headerName: "j2_data_saldo", flex: 3 },
    { field: "pag_saldo", headerName: "pag_saldo", flex: 1 },
    { field: "j2_incas_1", headerName: "j2_incas_1", flex: 1.6 },
    { field: "j2_incas_2", headerName: "j2_incas_2", flex: 1.6 },
    { field: "j2_incas_3", headerName: "j2_incas_3", flex: 1.6 },
    { field: "j2_incassato", headerName: "j2_incassato", flex: 1.6 },
    { field: "j2_da_incassare", headerName: "j2_da_incassare", flex: 1.6 },
    { field: "ordid", headerName: "ordid", flex: 1 },
    { field: "j2_dat_inc_1", headerName: "j2_dat_inc_1", flex: 2.4 },
    { field: "j2_dat_inc_2", headerName: "j2_dat_inc_2", flex: 2.4 },
    { field: "j2_dat_pag_contr", headerName: "j2_dat_pag_contr", flex: 2.4 },
    { field: "previs", headerName: "previs", flex: 1.5 },
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
                      disabled={isEditing}
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
                      disabled={isEditing}
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
                    {isEditing ? (
                      <TextField
                        sx={{
                          width: "115px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j2num}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j2num: e.target.value,
                          }))
                        }
                      />
                    ) : (
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
                        {selectedRow.j2num || ""}
                      </Box>
                    )}
                  </Typography>

                  <Typography sx={{ display: "flex", alignItems: "center" }}>
                    Data:{" "}
                    {isEditing ? (
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        value={fechaFormateada}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j1dat: e.target.value,
                          }))
                        }
                        sx={{ marginLeft: "4px" }}
                      />
                    ) : (
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
                        {fechaFormateada ? fechaFormateada : ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {isEditing ? (
                      <Box
                        sx={{
                          width: "380px",
                          height: "200px",
                        }}
                      >
                        <TextField
                          multiline
                          rows={13}
                          variant="outlined"
                          size="small"
                          value={selectedRow.j2preset || ""}
                          onChange={(e) =>
                            setSelectedRow((prev) => ({
                              ...prev,
                              j2preset: e.target.value,
                            }))
                          }
                          fullWidth
                        />
                      </Box>
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#ABBEFF",
                          width: "380px",
                          minHeight: "270px",
                          display: "inline-block",
                          backgroundColor: "#E2E8FF",
                        }}
                      >
                        {selectedRow.j2preset || ""}
                      </Box>
                    )}
                  </Typography>
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        sx={{ border: "0" }}
                        multiline
                        rows={4}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j2note || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j2note: e.target.value,
                          }))
                        }
                        fullWidth
                      />
                    ) : (
                      <Typography>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: "5px",
                            borderColor: "#CECECE",
                            minWidth: "250px",
                            minHeight: "90px",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          {selectedRow.j2note || ""}
                        </Box>
                      </Typography>
                    )}
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
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.j2imp || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          j2imp: e.target.value,
                        }))
                      }
                      sx={{ minWidth: "80px" }}
                    />
                  ) : (
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
                      {selectedRow.j2imp ? `€ ${selectedRow.j2imp}` : ""}
                    </Box>
                  )}
                  <Typography>J2%cnpaia:</Typography>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.j2pcnpaia || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          j2pcnpaia: e.target.value,
                        }))
                      }
                      sx={{ minWidth: "80px" }}
                    />
                  ) : (
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
                      {selectedRow.j2pcnpaia
                        ? `${selectedRow.j2pcnpaia * 100}%`
                        : ""}
                    </Box>
                  )}

                  <Typography>J2Cnpaia:</Typography>
                  <Box
                    onChange={(e) =>
                      handleFieldChange("j2cnpaia", e.target.value)
                    }
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
                    {selectedRow.j2cnpaia ? `€ ${selectedRow.j2cnpaia}` : ""}
                  </Box>

                  <Typography>J2ImpIva:</Typography>
                  <Box
                    onChange={(e) =>
                      handleFieldChange("j2impiva", e.target.value)
                    }
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
                    {selectedRow.j2impiva ? `€ ${selectedRow.j2impiva}` : ""}
                  </Box>
                  <Typography>J2%iva:</Typography>
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.j2piva || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          j2piva: e.target.value,
                        }))
                      }
                    />
                  ) : (
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
                      {selectedRow.j2piva ? `${selectedRow.j2piva * 100}%` : ""}
                    </Box>
                  )}

                  <Typography>J2Iva:</Typography>
                  <Box
                    onChange={(e) => handleFieldChange("j2iva", e.target.value)}
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
                    {selectedRow.j2iva ? `€ ${selectedRow.j2iva}` : ""}
                  </Box>
                  <Typography>J2Tot:</Typography>
                  <Box
                    onChange={(e) => handleFieldChange("j2tot", e.target.value)}
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
                    {selectedRow.j2tot ? `€ ${selectedRow.j2tot}` : ""}
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
                      disabled={isEditing}
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Part. Iva:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        width: "150px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.plva || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Cod. Fisc:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        minWidth: "150px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.cfisc || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    NomIndirizzo:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        minWidth: "150px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                        fontSize: "11px",
                      }}
                    >
                      {selectedJ03.nomindirizzo || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignItems: "center",
                    }}
                  >
                    Num CAP:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        minWidth: "150px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedJ03.nomcap || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Provincia:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        minWidth: "150px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FBFF80",
                        marginLeft: "8px",
                      }}
                    >
                      {selectedRow.nomprov || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Citta:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFFD77",
                        minWidth: "150px",
                        minHeight: "30px",
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
                        previs:{" "}
                        {isEditing ? (
                          <TextField
                            sx={{ width: "100px" }}
                            variant="outlined"
                            size="small"
                            value={selectedRow.previs || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                previs: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {selectedRow.previs
                              ? `€ ${selectedRow.previs}`
                              : ""}
                          </Box>
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-1:{" "}
                        {isEditing ? (
                          <TextField
                            sx={{ width: "100px" }}
                            variant="outlined"
                            size="small"
                            value={selectedRow.j2_incas_1 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_incas_1: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {selectedRow.j2_incas_1 !== null
                              ? `€ ${selectedRow.j2_incas_1}`
                              : ""}
                          </Box>
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-2:{" "}
                        {isEditing ? (
                          <TextField
                            sx={{ width: "100px" }}
                            variant="outlined"
                            size="small"
                            value={selectedRow.j2_incas_2 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_incas_2: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {selectedRow.j2_incas_2 !== null
                              ? `€ ${selectedRow.j2_incas_2}`
                              : ""}
                          </Box>
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-incas-3:{" "}
                        {isEditing ? (
                          <TextField
                            sx={{ width: "100px" }}
                            variant="outlined"
                            size="small"
                            value={selectedRow.j2_incas_3 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_incas_3: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {selectedRow.j2_incas_3 !== null
                              ? `€ ${selectedRow.j2_incas_3}`
                              : ""}
                          </Box>
                        )}
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
                            minHeight: "30px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_incassato !== null
                              ? `€ ${selectedRow.j2_incassato}`
                              : ""}
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
                            minHeight: "30px",
                            display: "inline-block",
                            backgroundColor: "#DCDCDC",
                            marginLeft: "8px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedRow.j2_da_incassare !== null
                              ? `€ ${selectedRow.j2_da_incassare}`
                              : ""}
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
                        J2-dat pag contr:{" "}
                        {isEditing ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={selectedRow.fechaformat3 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_dat_pag_contr: e.target.value,
                              }))
                            }
                            sx={{ width: "120px" }}
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {selectedRow.fechaformat3
                              ? selectedRow.fechaformat3
                              : ""}
                          </Box>
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat inc-1:{" "}
                        {isEditing ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={fechaformat4 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_dat_inc_1: e.target.value,
                              }))
                            }
                            sx={{ width: "120px" }}
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {fechaformat4 ? fechaformat4 : ""}
                          </Box>
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat inc-2:{" "}
                        {isEditing ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            type="date"
                            value={fechaformat5 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_dat_inc_2: e.target.value,
                              }))
                            }
                            sx={{ width: "120px" }}
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {fechaformat5 ? fechaformat5 : ""}
                          </Box>
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        J2-dat saldo:{" "}
                        {isEditing ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            type="date"
                            value={fechaformat2 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_dat_saldo: e.target.value,
                              }))
                            }
                            sx={{ width: "120px" }}
                          />
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              border: 1,
                              padding: 1,
                              borderRadius: "5px",
                              borderColor: "#DCDCDC",
                              minWidth: "70px",
                              minHeight: "30px",
                              display: "inline-block",
                              backgroundColor: "#DCDCDC",
                              marginLeft: "8px",
                              fontSize: "11px",
                            }}
                          >
                            {fechaformat2 ? fechaformat2 : ""}
                          </Box>
                        )}
                      </Typography>

                      <Typography>
                        pag-saldo:{" "}
                        <Checkbox
                          checked={selectedRow.pag_saldo}
                          disabled
                          color="primary"
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditClick}
                    sx={{ width: "60px" }}
                  >
                    Edit
                  </Button>
                  {isEditing && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveClick}
                      sx={{ width: "60px" }}
                    >
                      Save
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
        <DataGrid
          sx={{ height: expanded ? "250px" : "100%" }}
          getRowId={(row) => row.j02}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => {
            const selectedClick = params.row.j02;
            setSelectedJ02Click(selectedClick);
            const selectedRow =
              dataContacts.find((row) => row.j02 === selectedClick) || {};
            setSelectedId(selectedClick);
            setSelectedRow(selectedRow);
            setSelectedJ04(selectedRow.j04 || "");
            fetchJ03Data(selectedClick, selectedRow.j03 || "");
            setExpanded(true);
          }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
