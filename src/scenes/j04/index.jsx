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
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const J04 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataContacts, setDataContacts] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const fecha = selectedRow.cartdata ? new Date(selectedRow.cartdata) : null;
  const fechaFormateada = fecha ? fecha.toISOString().split("T")[0] : "";
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const backendUrl = "https://dbapirest.onrender.com/api/v1/j04";
  const [visibleData, setVisibleData] = useState([]);
  const [selectedJ03, setSelectedJ03] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => {
        setDataContacts(data);
        setVisibleData(data.filter((row) => row.j03 !== null));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && !loading) {
      const newData = dataContacts.slice(
        visibleData.length,
        visibleData.length + 10
      ); // Cargar más datos
      setVisibleData((prev) => [...prev, ...newData]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleData, dataContacts, loading]);

  const columns = [
    { field: "j04", headerName: "j04", flex: 0.2 },
    { field: "j03", headerName: "j03", flex: 0.9 },
    { field: "cartnomold", headerName: "cartnomold", flex: 1 },
    {
      field: "cartref",
      headerName: "cartref",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.4,
    },
    { field: "cartrif", headerName: "cartrif", flex: 0.2 },
    { field: "cartcoord", headerName: "cartcoord", flex: 0.3 },
    { field: "cartpag", headerName: "cartpag", flex: 1.2 },
    { field: "cartdescr", headerName: "cartdescr", flex: 1 },
    { field: "cartdata", headerName: "cartdata", flex: 0.36 },
    { field: "cartnote", headerName: "cartnote", flex: 1 },
  ];

  const handleRowClick = (params) => {
    const selectedClick = params.row.j04;
    const selectedRowData = dataContacts.find(
      (row) => row.j04 === selectedClick
    );
    setSelectedRow(selectedRowData || {});
    console.log("Selected Click:", selectedClick);
  };

  const handleNominativoChange = (e) => {
    const selectedJ03 = e.target.value;

    if (isEditing) {
      setSelectedRow((prev) => ({
        ...prev,
        j03: selectedJ03,
      }));
    } else {
      const selectedRowData = dataContacts.find(
        (row) => row.j03 === selectedJ03
      );
      setSelectedRow(selectedRowData || {});
    }
  };

  const handleSaveClick = () => {
    // Construir el objeto con los datos actualizados
    const updatedData = {
      j04: selectedRow.j04,
      j03: selectedRow.j03,
      cartnomold: selectedRow.cartnomold,
      cartref: selectedRow.cartref,
      cartrif: selectedRow.cartrif,
      cartcoord: selectedRow.cartcoord,
      cartpag: selectedRow.cartpag,
      cartdescr: selectedRow.cartdescr,
      cartdata: selectedRow.cartdata,
      cartnote: selectedRow.cartnote,
    };

    // Realizar la petición PUT para actualizar los datos en la API
    fetch(`${backendUrl}/${selectedRow.j04}`, {
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
          item.j04 === selectedRow.j04 ? updatedData : item
        );
        setDataContacts(updatedList);
        setIsEditing(false); // Deshabilitar el modo de edición
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h4">
              J04 DETAILS
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
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    J04:{" "}
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#B7B7B7",
                        minWidth: "100px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                      }}
                    >
                      {selectedRow.j04 || ""}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    Data:{" "}
                    {isEditing ? (
                      <TextField
                        type="date"
                        value={fechaFormateada || ""}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          setSelectedRow((prev) => ({
                            ...prev,
                            cartdata: newDate.toISOString(),
                          }));
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ width: "120px" }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#B7B7B7",
                          width: "100px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFFFF",
                        }}
                      >
                        {fechaFormateada ? fechaFormateada : ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Nominativo:
                  {isEditing ? (
                    <Select
                      sx={{ width: "390px", height: "30px" }}
                      value={selectedRow.j03 || ""}
                      onChange={handleNominativoChange}
                    >
                      {visibleData
                        .slice()
                        .filter((row) => row.j03 !== null)
                        .sort((a, b) => a.j03.localeCompare(b.j03))
                        .map((row) => (
                          <MenuItem key={row.j03} value={row.j03}>
                            {row.j03}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <Select
                      sx={{ width: "390px", height: "30px" }}
                      value={selectedRow.j03 || ""}
                      onChange={handleNominativoChange}
                    >
                      {visibleData
                        .slice()
                        .filter((row) => row.j03 !== null)
                        .sort((a, b) => a.j03.localeCompare(b.j03))
                        .map((row) => (
                          <MenuItem key={row.j03} value={row.j03}>
                            {row.j03}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Old Name:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.cartnomold || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          cartnomold: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                      sx={{ width: "300px", marginLeft: "8px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#B7B7B7",
                        width: "300px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                        marginLeft: "10px",
                      }}
                    >
                      {selectedRow.cartnomold || ""}
                    </Box>
                  )}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Descrizione:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.cartdescr || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          cartdescr: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                      sx={{ width: "390px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#B7B7B7",
                        width: "390px",
                        minHeight: "30px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                      }}
                    >
                      {selectedRow.cartdescr || ""}
                    </Box>
                  )}
                </Typography>

                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Note:
                  {isEditing ? (
                    <TextField
                      value={selectedRow.cartnote || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          cartnote: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                      multiline
                      minRows={3}
                      sx={{ minWidth: "340px" }}
                    />
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        border: 1,
                        padding: 1,
                        borderRadius: "5px",
                        borderColor: "#B7B7B7",
                        minWidth: "340px",
                        minHeight: "60px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                      }}
                    >
                      {selectedRow.cartnote || ""}
                    </Box>
                  )}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "45px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    CartRef:
                    {isEditing ? (
                      <TextField
                        value={selectedRow.cartref || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            cartref: e.target.value,
                          }))
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: "150px" }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#B7B7B7",
                          width: "150px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFFFF",
                        }}
                      >
                        {selectedRow.cartref || ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    CartRif:
                    {isEditing ? (
                      <TextField
                        value={selectedRow.cartrif || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            cartrif: e.target.value,
                          }))
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: "150px" }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#B7B7B7",
                          width: "150px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFFFF",
                        }}
                      >
                        {selectedRow.cartrif || ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "11px",
                    }}
                  >
                    CartCoord:{" "}
                    {isEditing ? (
                      <TextField
                        value={selectedRow.cartcoord || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            cartcoord: e.target.value,
                          }))
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: "150px" }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#B7B7B7",
                          minWidth: "150px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFFFF",
                        }}
                      >
                        {selectedRow.cartcoord || ""}
                      </Box>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    CartPag:{" "}
                    {isEditing ? (
                      <TextField
                        value={selectedRow.cartpag || ""}
                        onChange={(e) =>
                          setSelectedRow((prev) => ({
                            ...prev,
                            cartpag: e.target.value,
                          }))
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: "150px" }}
                      />
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          border: 1,
                          padding: 1,
                          borderRadius: "5px",
                          borderColor: "#B7B7B7",
                          minWidth: "150px",
                          minHeight: "30px",
                          display: "inline-block",
                          backgroundColor: "#FFFFF",
                        }}
                      >
                        {selectedRow.cartpag || ""}
                      </Box>
                    )}
                  </Typography>
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
          sx={{ height: expanded ? "430px" : "100%" }}
          getRowId={(row) => row.j04}
          rows={dataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={(params) => {
            handleRowClick(params);
            setExpanded(true);
          }}
        />
      </Box>
    </Box>
  );
};

export default J04;
