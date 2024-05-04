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

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataContacts, setDataContacts] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const backendUrl = "https://dbapirest.onrender.com/api/v1/j03";
  const [visibleData, setVisibleData] = useState([]);

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => setDataContacts(data))
      .catch((error) => console.error("Error fetching data:", error));
  };


  const handleExpandClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedData = {
      j03: selectedRow.j03,
      nomin: selectedRow.nomin,
      plva: selectedRow.plva,
      cfisc: selectedRow.cfisc,
      nomcitta: selectedRow.nomcitta,
      nomcap: selectedRow.nomcap,
      nomindirizzo: selectedRow.nomindirizzo,
      nomprov: selectedRow.nomprov,
      nomnote: selectedRow.nomnote,
      codident: selectedRow.codident,
      pec: selectedRow.pec
    };

    fetch(`${backendUrl}/${selectedRow.j03}`, {
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
        const updatedList = dataContacts.map((item) =>
          item.j03 === selectedRow.j03 ? updatedData : item
        );
        setDataContacts(updatedList);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };


  const handleRowClick = (params) => {
    const selectedClick = params.row.j03;
    const selectedRowData = dataContacts.find(
      (row) => row.j03 === selectedClick
    );
    setSelectedRow(selectedRowData || {});
    console.log("selected row: ", selectedClick);
  };

  const columns = [
    { field: "j03", headerName: "j03", flex: 0.1 },
    { field: "nomin", headerName: "nomin", flex: 1.5 },
    { field: "plva", headerName: "plva", flex: 0.65 },
    {
      field: "cfisc",
      headerName: "cfisc",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.9,
    },
    { field: "nomcitta", headerName: "nomcitta", flex: 1.1 },
    { field: "nomcap", headerName: "nomcap", flex: 0.5 },
    { field: "nomindirizzo", headerName: "nomindirizzo", flex: 1.1 },
    { field: "nomprov", headerName: "nomprov", flex: 0.4 },
    { field: "nomnote", headerName: "nomnote", flex: 1.5 },
    { field: "codident", headerName: "codident", flex: 0.5 },
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
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h4">
              J03 DETAILS
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  J03:{" "}
                  <Box
                    component="span"
                    sx={{
                      border: 1,
                      padding: 1,
                      borderRadius: "5px",
                      borderColor: "#B7B7B7",
                      width: "60px",
                      minHeight: "30px",
                      display: "inline-block",
                      backgroundColor: "#FFFFF",
                      marginLeft: "100px",
                    }}
                  >
                    {selectedRow.j03 || ""}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomin:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomin || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomin: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.nomin || ""}{" "}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Plva:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.plva || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          plva: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                        marginLeft: "15px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                      }}
                    >
                      {selectedRow.plva || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Cfisc:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.cfisc || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          cfisc: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                        marginLeft: "5px",
                        display: "inline-block",
                        backgroundColor: "#FFFFF",
                      }}
                    >
                      {selectedRow.cfisc || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomcitta:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomcitta || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomcitta: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
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
                      {selectedRow.nomcitta || ""}
                    </Box>
                  )}
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomcap:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomcap || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomcap: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.nomcap || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomindirizzo:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomindirizzo || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomindirizzo: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.nomindirizzo || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomprov:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomprov || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomprov: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.nomprov || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Nomnote:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.nomnote || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          nomnote: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.nomnote || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Codident:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.codident || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          codident: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.codident || ""}
                    </Box>
                  )}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  Pec:{" "}
                  {isEditing ? (
                    <TextField
                      value={selectedRow.pec || ""}
                      onChange={(e) =>
                        setSelectedRow((prev) => ({
                          ...prev,
                          pec: e.target.value,
                        }))
                      }
                      variant="outlined"
                      size="small"
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
                      {selectedRow.pec || ""}
                    </Box>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={2}>
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
          sx={{ height: expanded ? "450px" : "100%" }}
          getRowId={(row) => row.j03}
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

export default Invoices;
