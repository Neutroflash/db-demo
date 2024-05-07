import React, { useState, useEffect, Suspense } from "react";
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
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [j03Values, setJ03Values] = useState([]);
  const [dataJ03, setDataJ03] = useState([]);
  const backendUrl = "https://dbapirest.onrender.com/api/v1/postgres";
  const fecha = selectedRow.j1dat ? new Date(selectedRow.j1dat) : null;
  const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";
  const handleExpandClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchJ03Data();
  }, []);

  useEffect(() => {
    fetch(`https://dbapirest.onrender.com/api/v1/j04`)
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

  const fetchJ03Data = () => {
    fetch(`https://dbapirest.onrender.com/api/v1/j03`)
      .then((response) => response.json())
      .then((data) => {
        setDataJ03(data);
        const nominValues = data.map((row) => row.nomin);
        setJ03Values(nominValues);
      })
      .catch((error) => console.error("Error fetching J03 data:", error));
  };

  useEffect(() => {
    fetchJ03Data();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClientiChange = (value) => {
    if (isEditing) {
      setSelectedRow((prev) => ({
        ...prev,
        j03: value,
      }));
    } else {
      const rowData = getRowDataByJ03(value);
      setSelectedRow((prev) => ({
        ...rowData, // Esto asignará los valores de rowData, o un objeto vacío si rowData es falsy
        j03: value,
      }));
    }
  };

  const handleJ04Change = (value) => {
    if (isEditing) {
      setSelectedRow((prev) => ({
        ...prev,
        j04: value,
      }));
    } else {
      const relatedJ01Row = dataContacts.find((row) => row.j04 === value);

      setSelectedRow((prev) => ({
        ...prev,
        ...(relatedJ01Row || {
          j01: "",
          j1titol: "",
          j1note: "",
          j1dat: "",
          j03: "",
          link_ordine: "",
          j1_avanz: "",
          j1rif_offer: "",
          j1rif_client: "",
          j1impiva: "",
          sel: "",
        }),
        j04: value,
      }));
    }
  };

  const getRowDataByJ03 = (j03Value) => {
    const selectedRow = dataContacts.find((row) => row.j03 === j03Value);
    return selectedRow ? selectedRow : {};
  };

  const handleSaveClick = () => {
    // Construir el objeto con los datos actualizados
    const updatedData = {
      j01: selectedRow.j01,
      j03: selectedRow.j03,
      j04: selectedRow.j04,
      j1impiva: selectedRow.j1impiva,
      j1rif_offer: selectedRow.j1rif_offer,
      j1rif_client: selectedRow.j1rif_client,
      j1dat: selectedRow.j1dat,
      j1titol: selectedRow.j1titol,
      j1note: selectedRow.j1note,
      j1fat_1: selectedRow.j1fat_1,
      j1fat_1_rif: selectedRow.j1fat_1_rif,
      j1fat_2: selectedRow.j1fat_2,
      j1fat_2_rif: selectedRow.j1fat_2_rif,
      j1fat_3: selectedRow.j1fat_3,
      j1fat_3_rif: selectedRow.j1fat_3_rif,
      j1tot_fat: selectedRow.j1tot_fat,
      sel: selectedRow.sel,
      link_ordine: selectedRow.link_ordine,
      j1_avanz: selectedRow.j1_avanz,
      j1_av_data: selectedRow.j1_av_data,
    };

    // Realizar la petición PUT para actualizar los datos en la API
    fetch(`${backendUrl}/${selectedRow.j01}`, {
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
          item.j01 === selectedRow.j01 ? updatedData : item
        );
        setDataContacts(updatedList);
        setIsEditing(false); // Deshabilitar el modo de edición
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

  const handleAddRow = () => {
    setSelectedRow({
      j01: getLastJ01() + 1,
      j03: "",
      j04: "",
      j1impiva: "",
      j1rif_offer: "",
      j1rif_client: "",
      j1dat: "",
      j1titol: "",
      j1note: "",
      j1fat_1: "",
      j1fat_1_rif: "",
      j1fat_2: "",
      j1fat_2_rif: "",
      j1fat_3: "",
      j1fat_3_rif: "",
      j1tot_fat: "",
      sel: false,
      link_ordine: "",
      j1_avanz: "",
      j1_av_data: "",
    });
  };
  
  const getLastJ01 = () => {
    const lastJ01 = Math.max(...dataContacts.map((row) => row.j01));
    return isNaN(lastJ01) ? 0 : lastJ01;
  };
  
  const columns = [
    { field: "j01", headerName: "j01", flex: 0.2 },
    { field: "j03", headerName: "j03", flex: 1.4 },
    {
      field: "j04",
      headerName: "j04",
      flex: 0.2,
      cellClassName: "name-column--cell",
    },
    {
      field: "j1impiva",
      headerName: "j1impiva",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.7,
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
      flex: 0.75,
    },
    {
      field: "j1titol",
      headerName: "j1titol",
      flex: 1.4,
    },
    {
      field: "j1note",
      headerName: "j1note",
      flex: 0.8,
    },
    {
      field: "j1fat_1",
      headerName: "j1fat_1",
      flex: 0.1,
    },
    {
      field: "j1fat_1_rif",
      headerName: "j1fat_1_rif",
      flex: 0.1,
    },
    {
      field: "j1fat_2",
      headerName: "j1fat_2",
      flex: 0.1,
    },
    {
      field: "j1fat_2_rif",
      headerName: "j1fat_2_rif",
      flex: 0.1,
    },
    {
      field: "j1fat_3",
      headerName: "j1fat_3",
      flex: 0.1,
    },
    {
      field: "j1fat_3_rif",
      headerName: "j1fat_3_rif",
      flex: 0.1,
    },
    {
      field: "j1tot_fat",
      headerName: "j1tot_fat",
      flex: 0.1,
    },
    {
      field: "sel",
      headerName: "sel",
      flex: 0.2,
    },
    {
      field: "link_ordine",
      headerName: "link_ordine",
      flex: 1,
    },
    {
      field: "j1_avanz",
      headerName: "j1_avanz",
      flex: 0.4,
    },
    {
      field: "j1_av_data",
      headerName: "j1_av_data",
      flex: 0.8,
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h4">
              J01 DETAILS
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
                        width: "70px",
                        minHeight: "35px",
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                    }}
                  >
                    Ordine Cliente:{" "}
                    {isEditing ? (
                      <TextField
                        sx={{ width: "180px" }}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j1rif_client}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j1rif_client: e.target.value,
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
                          borderColor: "#FFBAAB",
                          width: "180px",
                          minHeight: "35px",
                          display: "inline-block",
                          backgroundColor: "#FFD3D3",
                          fontSize: "11px",
                        }}
                      >
                        {selectedRow.j1rif_client || ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                {/* Titolo */}
                <Box>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    Titolo:
                    {isEditing ? (
                      <TextField
                        sx={{ width: "90%" }}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j1titol}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j1titol: e.target.value,
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
                          borderColor: "#FFBAAB",
                          width: "90%",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFD3D3",
                          fontSize: "12px",
                        }}
                      >
                        {selectedRow.j1titol || ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                {/* Note */}
                <Box>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    Note:
                    {isEditing ? (
                      <TextField
                        multiline
                        sx={{ width: "90%" }}
                        rows={4}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j1note}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j1note: e.target.value,
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
                    )}
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
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                    }}
                  >
                    Data-ordine:{" "}
                    {isEditing ? (
                      <TextField
                        sx={{ width: "120px" }}
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
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#FFBAAB",
                          minWidth: "70px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFD3D3",
                          fontSize: "12px",
                        }}
                      >
                        {fechaFormateada ? fechaFormateada : ""}
                      </Box>
                    )}
                  </Typography>

                  {/* Ordine-Imp IVA */}
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                    }}
                  >
                    Ordine-Imp IVA:
                    {isEditing ? (
                      <TextField
                        sx={{ width: "100px" }}
                        variant="outlined"
                        size="small"
                        value={selectedRow.j1impiva}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            j1impiva: e.target.value,
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
                          borderColor: "#FFBAAB",
                          minWidth: "70px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFD3D3",
                          fontSize: "12px",
                        }}
                      >
                        {selectedRow.j1impiva
                          ? `€ ${selectedRow.j1impiva}`
                          : ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                {/* Clienti */}
                <Box>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Clienti:
                    {isEditing ? (
                      <Select
                        value={selectedRow.j03 || ""}
                        onChange={(e) => handleClientiChange(e.target.value)}
                        sx={{
                          width: "300px",
                          minHeight: "40px",
                          fontSize: "11px",
                          backgroundColor: "#FBFF80",
                        }}
                      >
                        {j03Values
                          .sort((a, b) => a.localeCompare(b))
                          .map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      <Select
                        value={selectedRow.j03 || ""}
                        onChange={(e) => handleClientiChange(e.target.value)}
                        sx={{
                          width: "300px",
                          minHeight: "40px",
                          fontSize: "11px",
                          backgroundColor: "#FBFF80",
                        }}
                      >
                        {j03Values
                          .sort((a, b) => a.localeCompare(b))
                          .map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
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
                        padding: 1,
                        minWidth: "70px",
                        minHeight: "50px",
                        display: "",
                        fontSize: "12px",
                      }}
                    >
                      {isEditing ? (
                        <Suspense fallback={<div>Loading...</div>}>
                          <Select
                            value={selectedRow.j04 || ""}
                            onChange={(e) =>
                              handleJ04Change(e.target.value, "edit")
                            }
                            sx={{
                              fontSize: "12px",
                              backgroundColor: "#C9FFB5",
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
                            value={selectedRow.j04 || ""}
                            onChange={(e) =>
                              handleJ04Change(e.target.value, "view")
                            }
                            sx={{
                              fontSize: "12px",
                              backgroundColor: "#C9FFB5",
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
                      )}
                    </Box>
                    <Typography>
                      <Box
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#C9FFB5",
                          width: "200px",
                          minHeight: "50px",
                          display: "inline-block",
                          backgroundColor: "#C9FFB5",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {selectedRow.j04 &&
                          j04Options.find(
                            (option) => option.j04 === selectedRow.j04
                          )?.cartdescr}
                      </Box>
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={2.5}
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
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.link_ordine || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          link_ordine: e.target.value,
                        }))
                      }
                      sx={{ width: "170px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFBAAB",
                        width: "170px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFD3D3",
                        fontSize: "10px",
                      }}
                    >
                      {selectedRow.link_ordine || ""}
                    </Box>
                  )}
                </Typography>
                {/* Avanzamento */}
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                    gap: "15px",
                  }}
                >
                  Avanzamento:{" "}
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.j1_avanz || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          j1_avanz: e.target.value,
                        }))
                      }
                      sx={{ width: "40px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFBAAB",
                        width: "40px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFD3D3",
                        fontSize: "10px",
                      }}
                    >
                      {selectedRow.j1_avanz
                        ? `${selectedRow.j1_avanz * 100}%`
                        : ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    gap: "30px",
                  }}
                >
                  offerta:{" "}
                  {isEditing ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={selectedRow.j1rif_offer || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          j1rif_offer: e.target.value,
                        }))
                      }
                      sx={{ width: "170px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#FFBAAB",
                        width: "170px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFD3D3",
                        fontSize: "10px",
                      }}
                    >
                      {selectedRow.j1rif_offer}
                    </Box>
                  )}
                </Typography>
                {/* Ordine fatturato */}
                <Typography
                  sx={{
                    display: "flex",
                    marginLeft: "20px",
                    alignItems: "center",
                    gap: "50px",
                  }}
                >
                  Ordine fatturato:{" "}
                  {isEditing ? (
                    <Checkbox
                      checked={selectedRow.sel}
                      color="primary"
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          sel: e.target.checked,
                        }))
                      }
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  ) : (
                    <Checkbox
                      checked={selectedRow.sel}
                      disabled
                      color="primary"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  )}
                </Typography>
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
                  {isEditing ? null : (
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddRow}
                        sx={{ width: "60px" }}
                      >
                        Add
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
        <DataGrid
          sx={{ height: expanded ? "500px" : "100%" }}
          getRowId={(row) => row.j01}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => {
            const selectedJ01 = params.row.j01;
            setSelectedJ01(selectedJ01);
            setSelectedRow(params.row);
            setExpanded(true);
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;
