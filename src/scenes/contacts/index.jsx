import { useEffect, useState, Suspense } from "react";
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
  const [selectedJ01, setSelectedJ01] = useState("");
  const [selectedJ03, setSelectedJ03] = useState({});
  const [j04Options, setJ04Options] = useState([]);
  const [j01Options, setJ01Options] = useState([]);
  const [j01CommData, setJ01CommData] = useState([]);
  const [selectedJ02Click, setSelectedJ02Click] = useState(null);
  const [dataJ03, setDataJ03] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(selectedRow);
  const [originalData, setOriginalData] = useState(null);
  const [isAddingRow, setIsAddingRow] = useState(false);
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
  const fechaformat4 = fecha4 ? fecha4.toISOString().split("T")[0] : "";
  const fechaformat5 = fecha5 ? fecha5.toISOString().split("T")[0] : "";
  const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";
  const datacontr = fecha3 ? fecha3.toISOString().split("T")[0] : "";
  const handleExpandClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetch(`https://dbapirest.onrender.com/api/v1/j04`)
      .then((response) => response.json())
      .then((data) => {
        setJ04Options(data);
      })
      .catch((error) => console.error("Error fetching j04 options:", error));
  }, []);

  useEffect(() => {
    fetch(`https://dbapirest.onrender.com/api/v1/postgres`)
      .then((response) => response.json())
      .then((data) => {
        setJ01Options(data);
      })
      .catch((error) => console.error("Error fetching j01 options:", error));
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalData(selectedRow);
  };

  const fetchData = () => {
    fetch("https://dbapirest.onrender.com/api/v1/j02")
      .then((response) => response.json())
      .then((data) => setDataContacts(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchJ03Data = (selectedId, selectedJ03) => {
    fetch(
      `https://dbapirest.onrender.com/api/v1/j03?j02=${selectedId}&j03=${selectedJ03}`
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

    // Encuentra el ID correspondiente al nomin seleccionado en J03_NOMIN_CLIENTI
    const selectedJ03Data =
      dataJ03.find((row) => row.nomin === selectedNomin) || {};
    const selectedJ03Id = selectedJ03Data.j03 || "";

    // Actualiza el estado local del selector
    setSelectedJ03(selectedJ03Data);

    if (isEditing || isAddingRow) {
      // Actualiza la columna j03 de la fila seleccionada en J02_FAT con el ID encontrado
      fetch(`https://dbapirest.onrender.com/api/v1/j02/${selectedRow.j02}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ j03: selectedJ03Id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar los datos");
          }
          // Actualiza el estado local de los datos de la fila seleccionada en J02_FAT
          setSelectedRow((prevRow) => ({
            ...prevRow,
            j03: selectedJ03Id,
          }));
        })
        .catch((error) =>
          console.error("Error al actualizar los datos:", error)
        );
    } else {
      // Actualiza los demás datos relevantes cuando no estás en modo edición
      setDataContacts((data) => {
        // Encuentra la fila seleccionada en los nuevos datos de j02 en modo visualización
        const selectedRow = data.find((row) => row.j02 === selectedJ03Id) || {};
        setSelectedRow(selectedRow);

        // Actualiza otros datos relacionados con j02 en modo visualización
        setSelectedId(selectedRow.j02 || "");
        setSelectedJ04(selectedRow.j04 || "");

        return data;
      });
    }
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

    if (isEditing || isAddingRow) {
      setSelectedRow((prevRow) => ({
        ...prevRow,
        j04: selectedJ04,
      }));
    } else {
      const selectedRow =
        dataContacts.find((row) => row.j04 === selectedJ04) || {};
      setSelectedRow(selectedRow);

      const selectedJ02 = selectedRow.j02 || "";
      setSelectedId(selectedJ02);

      const selectedJ03 = selectedRow.j03 || "";
      fetchJ03Data(selectedJ02, selectedJ03);
    }
  };

  const handleJ01Change = (event) => {
    const selectedJ01 = event.target.value;
    setSelectedJ01(selectedJ01);

    if (isEditing || isAddingRow) {
      setSelectedRow((prevRow) => ({
        ...prevRow,
        j01: selectedJ01,
      }));
    } else {
      const selectedRow =
        j01Options.find((row) => row.j01 === selectedJ01) || {};
      setSelectedRow(selectedRow);

      const selectedJ03 = selectedRow.j03 || "";
      const selectedJ04 = selectedRow.j04 || "";
      setSelectedId(selectedJ04);

      // Fetch data for J03 based on selectedJ04
      fetchJ03Data(selectedJ04, selectedJ03);
    }
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
      j01: selectedRow.j01,
      j04: selectedRow.j04,
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
    fetch(`https://dbapirest.onrender.com/api/v1/j02/${selectedRow.j02}`, {
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

  const handleAddRow = () => {
    setIsAddingRow(true);
    const newJ02 = getLastJ02();

    // Realizar los cálculos necesarios
    const j2imp = parseFloat(selectedRow.j2imp) || 0;
    const j2pcnpaia = parseFloat(selectedRow.j2pcnpaia) || 0;
    const j2piva = parseFloat(selectedRow.j2piva) || 0;

    const j2cnpaia = j2imp * j2pcnpaia;
    const j2impiva = j2cnpaia + j2imp;
    const j2iva = j2impiva * (j2piva / 100); // Dividir por 100 para obtener el porcentaje
    const j2tot = j2imp + j2iva + j2cnpaia;

    // Calcular j2_incassato
    const j2_incassato =
      parseFloat(selectedRow.j2_incas_1) +
      parseFloat(selectedRow.j2_incas_2) +
      parseFloat(selectedRow.j2_incas_3);

    // Calcular j2_da_incassare
    const j2_da_incassare = j2tot - j2_incassato;

    // Crear la nueva fila con los cálculos realizados
    const newRow = {
      j02: newJ02,
      j2num: "",
      j2dat: "",
      j03: "",
      j04: "",
      j2preset: "",
      j2imp: j2imp.toFixed(2),
      j2pcnpaia: j2pcnpaia.toFixed(2),
      j2cnpaia: j2cnpaia.toFixed(2),
      j2impiva: j2impiva.toFixed(2),
      j2piva: j2piva.toFixed(2),
      j2iva: j2iva.toFixed(2),
      j2tot: j2tot.toFixed(2),
      j2note: "",
      j2_data_saldo: "",
      pag_saldo: "",
      j2_incas_1: "",
      j2_incas_2: "",
      j2_incas_3: "",
      j2_incassato: j2_incassato.toFixed(2),
      j2_da_incassare: j2_da_incassare.toFixed(2),
      ordid: "",
      j2_dat_inc_1: "",
      j2_dat_inc_2: "",
      j2_dat_pag_contr: "",
      previs: "",
    };

    // Actualizar el estado local de los datos de la factura
    setDataContacts([...dataContacts, newRow]);
    setSelectedRow(newRow);
    setSelectedId(newJ02);
  };

  const handleCancelAddRow = () => {
    window.location.reload();
  };

  const getLastJ02 = () => {
    if (dataContacts.length === 0) {
      return 1; // Si no hay contactos, comenzar desde 1
    }
    const lastJ02 = Math.max(...dataContacts.map((row) => row.j02));
    return lastJ02 + 1; // Devolver el máximo + 1
  };

  const handleSaveAddRow = () => {
    fetch("https://dbapirest.onrender.com/api/v1/j02", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedRow),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add new row");
        }
        return response.json();
      })
      .then((data) => {
        console.log("New row added:", data);
        setDataContacts([...dataContacts, selectedRow]); // Actualizar estado local con la fila agregada
        setIsAddingRow(false); // Cerrar el modo de añadir
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding new row:", error);
        window.location.reload();
      });
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
                      disabled={isEditing || isAddingRow}
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
                    {isEditing || isAddingRow ? (
                      <Select
                        variant="outlined"
                        value={selectedRow.j01}
                        onChange={handleJ01Change}
                        fullWidth
                        style={{ marginLeft: "10px" }}
                        sx={{
                          width: "74px",
                          backgroundColor: "#FFD3D3",
                          maxHeight: "250px",
                        }}
                        MenuProps={{ style: { maxHeight: "450px" } }}
                      >
                        {j01Options.map((option) => (
                          <MenuItem key={option.j01} value={option.j01}>
                            {option.j01}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Box
                        component="div"
                        sx={{
                          display: "flex",
                          marginLeft: "10px",
                          backgroundColor: "#FFD3D3",
                          padding: "6px 12px",
                          width: "60px",
                          minHeight: "50px",
                          borderRadius: "4px",
                          textAlign: "center",
                          alignItems: "center",
                        }}
                      >
                        {selectedRow.j01}
                      </Box>
                    )}
                  </Typography>

                  <Typography>
                    J04:
                    {isEditing || isAddingRow ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <Select
                          variant="outlined"
                          value={selectedJ04}
                          onChange={handleJ04Change}
                          fullWidth
                          style={{ marginLeft: "10px" }}
                          sx={{
                            width: "74px",
                            backgroundColor: "#D3FFEE",
                            maxHeight: "250px",
                          }}
                          MenuProps={{ style: { maxHeight: "450px" } }}
                        >
                          {j04Options.map((option) => (
                            <MenuItem key={option.j04} value={option.j04}>
                              {option.j04}
                            </MenuItem>
                          ))}
                        </Select>
                      </Suspense>
                    ) : (
                      <Suspense fallback={<div>Loading...</div>}>
                        <Select
                          variant="outlined"
                          value={selectedJ04}
                          onChange={handleJ04Change}
                          fullWidth
                          style={{ marginLeft: "10px" }}
                          sx={{ width: "74px", backgroundColor: "#D3FFEE" }}
                          MenuProps={{ style: { maxHeight: "450px" } }}
                        >
                          {j04Options.map((option) => (
                            <MenuItem key={option.j04} value={option.j04}>
                              {option.j04}
                            </MenuItem>
                          ))}
                        </Select>
                      </Suspense>
                    )}
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
                    {isEditing || isAddingRow ? (
                      <TextField
                        sx={{
                          width: "115px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j2num || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j2num:
                              e.target.value === "" ? null : e.target.value,
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
                    {isEditing || isAddingRow ? (
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        value={fechaFormateada || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j2dat: e.target.value,
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
                    {isEditing || isAddingRow ? (
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
                    {isEditing || isAddingRow ? (
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
                  {isEditing || isAddingRow ? (
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
                  {isEditing || isAddingRow ? (
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
                  {isEditing || isAddingRow ? (
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
                    {isEditing || isAddingRow ? (
                      <Select
                        variant="outlined"
                        value={selectedJ03.nomin || ""}
                        onChange={handleJ03Change}
                        fullWidth
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "#FBFF80",
                        }}
                      >
                        {dataJ03
                          .slice()
                          .sort((a, b) => a.nomin.localeCompare(b.nomin))
                          .map((row) => (
                            <MenuItem key={row.nomin} value={row.nomin}>
                              {row.nomin}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      <Select
                        variant="outlined"
                        value={selectedJ03.nomin || ""}
                        onChange={handleJ03Change}
                        fullWidth
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "#FBFF80",
                        }}
                      >
                        {dataJ03
                          .slice()
                          .sort((a, b) => a.nomin.localeCompare(b.nomin))
                          .map((row) => (
                            <MenuItem key={row.nomin} value={row.nomin}>
                              {row.nomin}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
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
                      {selectedJ03.nomprov || ""}
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
                        {isEditing || isAddingRow ? (
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
                        {isEditing || isAddingRow ? (
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
                            {selectedRow.j2_incas_1 !== null &&
                            selectedRow.j2_incas_1 !== undefined &&
                            selectedRow.j2_incas_1.trim() !== ""
                              ? `€ ${selectedRow.j2_incas_1}`
                              : "0"}
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
                        {isEditing || isAddingRow ? (
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
                            {selectedRow.j2_incas_2 !== null &&
                            selectedRow.j2_incas_2 !== undefined &&
                            selectedRow.j2_incas_1.trim() !== ""
                              ? `€ ${selectedRow.j2_incas_2}`
                              : "0"}
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
                        {isEditing || isAddingRow ? (
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
                            {selectedRow.j2_incas_3 !== null &&
                            selectedRow.j2_incas_3 !== undefined &&
                            selectedRow.j2_incas_1.trim() !== ""
                              ? `€ ${selectedRow.j2_incas_3}`
                              : "0"}
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
                        {isEditing || isAddingRow ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={datacontr || ""}
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
                            {datacontr ? datacontr : ""}
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
                        {isEditing || isAddingRow ? (
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
                        {isEditing || isAddingRow ? (
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
                        {isEditing || isAddingRow ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            type="date"
                            value={fechaformat2 || ""}
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                j2_data_saldo: e.target.value,
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
                        {isEditing || isAddingRow ? (
                          <Checkbox
                            checked={selectedRow.pag_saldo}
                            color="primary"
                            onChange={(e) =>
                              setSelectedRow((prev) => ({
                                ...prev,
                                pag_saldo: e.target.checked,
                              }))
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        ) : (
                          <Checkbox
                            checked={selectedRow.pag_saldo}
                            color="primary"
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        )}
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
                  sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
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
                  {isAddingRow && (
                    <Box sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveAddRow}
                        disabled={!selectedRow.j2num}
                        sx={{ width: "60px" }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCancelAddRow}
                        sx={{ width: "60px" }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                  {!isEditing && !isAddingRow && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditClick}
                      sx={{ width: "60px" }}
                    >
                      Edit
                    </Button>
                  )}
                  {!isEditing && !isAddingRow && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddRow}
                      sx={{ width: "60px" }}
                    >
                      Add
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
