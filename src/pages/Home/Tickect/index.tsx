import React from "react";
import {
    AlertColor,
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";
import HeaderBox from "../../../components/common/Header";
import { createTicket, fetchOneTicket, fetchTicket, fetchUser, updateTicket } from "../../../service";
import { ITicket, IUser } from "../../../interfaces";
import moment from "moment";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomDataGrid from "../../../components/common/Grid";
import AddModal from "./Modals/AddModal";
import AlertSanck from "../../../components/common/Alert";
import EditdModal from "./Modals/EditdModal";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { AuthContext } from "../../../Auth/AuthProvider";


const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
};

export default function Ticket() {
    const { user: userContext } = React.useContext(AuthContext);
    const [idTicket, setIdTicket] = React.useState();
    const [ticket, setTicket] = React.useState<ITicket[]>();
    const [oneticket, setOneTicket] = React.useState<ITicket>()
    const [user, setUser] = React.useState<IUser[]>();
    const [open, setOpen] = React.useState<boolean>(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    // 🔹 Estado del formulario del modal
    const [tipoTicket, setTipoTicket] = React.useState<string>("INCIDENCIA");
    const [titulo, setTitulo] = React.useState<string>("");
    const [descripcion, setDescripcion] = React.useState<string>("");
    const [estado, setEstado] = React.useState<string>("");
    const [prioridad, setPrioridad] = React.useState<string>("");
    const [tipo, setTipo] = React.useState<string>("");
    const [creadoPorId, setCreadoPorId] = React.useState<number | string | null>(null);
    const [asignadoAId, setAsignadoAId] = React.useState<number | string | null>(null);
    const [tiempoEstimado, setTiempoEstimado] = React.useState<number | null>(null);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState<AlertColor>("success");

    React.useEffect(() => {
        const renderData = async () => {
            await getTicket();
            await getUser()
        }
        renderData()
    }, []);

    React.useEffect(() => {
        if (idTicket) {
            findOneTicket(idTicket)
        }
    }, [idTicket]);

    const getTicket = async () => {
        try {
            const response = await fetchTicket();
            const { code, data } = response;
            if (code === "000") {
                setTicket(data as ITicket[]);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const findOneTicket = async (idTicket: any) => {
        try {
            const response = await fetchOneTicket(idTicket as any);
            const { code, data } = response;
            if (code === "000") {
                if (data) {
                    setTipoTicket(data.tipoTicket ?? "INCIDENCIA");
                    setTitulo(data.titulo ?? "");
                    setDescripcion(data.descripcion ?? "");
                    setEstado(data.estado ?? "");
                    setPrioridad(data.prioridad ?? "");
                    setTipo(data.tipo ?? "");
                    setCreadoPorId(data.creadoPor?.IdUser);
                    setAsignadoAId(data.asignadoAId ?? null);
                    setTiempoEstimado(data.tiempoEstimado ?? null);
                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetchUser();
            const { code, data } = response;
            if (code === "000") {
                setUser(data as IUser[]);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "ABIERTO":
                return "success";
            case "PENDIENTE":
                return "warning";
            case "CERRADO":
                return "default";
            default:
                return "default";
        }
    };

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case "ALTA":
                return "error";
            case "MEDIA":
                return "warning";
            case "BAJA":
                return "success";
            default:
                return "default";
        }
    };

    const resetForm = () => {
        setTitulo("")
        setDescripcion("")
        setEstado("")
        setPrioridad("")
        setTipo("")
        setCreadoPorId(null)
        setAsignadoAId(null)
        setTiempoEstimado(null)
    }

    const submitEditTicket = async () => {
        try {
            const response = await updateTicket(idTicket ?? "", {
                tipoTicket: tipoTicket,
                titulo: titulo,
                descripcion: descripcion,
                estado: estado,
                prioridad: prioridad,
                tipo: tipo,
                creadoPorId: Number(creadoPorId),
                asignadoAId: Number(asignadoAId),
                tiempoEstimado: tiempoEstimado
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getTicket();

                setOpenEdit(false);
                resetForm()


                setSnackbarMessage(message);
                setSnackbarColor("success");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage(message);
                setSnackbarColor("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const submitFinalizarTicket = async (idTicket: any) => {
        try {
            const response = await updateTicket(idTicket ?? "", {
                activo: userContext.rol === "Gerente TI" ? true : false,
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getTicket();

                setSnackbarMessage(message);
                setSnackbarColor("success");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage(message);
                setSnackbarColor("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const submitTilkect = async () => {
        try {
            const response = await createTicket({
                tipoTicket: tipoTicket,
                titulo: titulo,
                descripcion: descripcion,
                estado: estado,
                prioridad: prioridad,
                tipo: tipo,
                creadoPorId: Number(creadoPorId),
                asignadoAId: Number(asignadoAId),
                tiempoEstimado: tiempoEstimado
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getTicket();

                setOpen(false);
                resetForm()


                setSnackbarMessage(message);
                setSnackbarColor("success");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage(message);
                setSnackbarColor("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => {
        resetForm()
        setOpenEdit(false)
    };
    const handleCloseSnackbar = () => setSnackbarOpen(false);




    const viewModal = () => {
        return (
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        Nuevo ticket
                    </Typography>

                    <AddModal
                        tipoTicket={tipoTicket}
                        titulo={titulo}
                        user={user as IUser[]}
                        descripcion={descripcion}
                        estado={estado}
                        prioridad={prioridad}
                        tiempoEstimado={tiempoEstimado}
                        tipo={tipo}
                        creadoPorId={creadoPorId as any}
                        asignadoAId={asignadoAId}
                        handleTipoTicket={(value: string) => setTipoTicket(value)}
                        handleTitle={(value: string) => setTitulo(value)}
                        handleDescripcion={(value: string) => setDescripcion(value)}
                        handleEstado={(value: string) => setEstado(value)}
                        handlePrioridad={(value: string) => setPrioridad(value)}
                        handleTipo={(value: string) => setTipo(value)}
                        handleCreadoPorId={(value: any) => setCreadoPorId(value)}
                        handleAsignadoAId={(value: any) => setAsignadoAId(value)}
                        handleTiempoEstimado={(value: any) => setTiempoEstimado(value)}
                        onSave={submitTilkect}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        );
    };

    const viewEditModal = () => {
        return (
            <Modal open={openEdit} onClose={handleCloseEdit}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        Editar ticket
                    </Typography>

                    <EditdModal
                        tipoTicket={tipoTicket}
                        titulo={titulo}
                        user={user as IUser[]}
                        descripcion={descripcion}
                        estado={estado}
                        prioridad={prioridad}
                        tiempoEstimado={tiempoEstimado}
                        tipo={tipo}
                        creadoPorId={creadoPorId as any}
                        asignadoAId={asignadoAId}
                        handleTipoTicket={(value: string) => setTipoTicket(value)}
                        handleTitle={(value: string) => setTitulo(value)}
                        handleDescripcion={(value: string) => setDescripcion(value)}
                        handleEstado={(value: string) => setEstado(value)}
                        handlePrioridad={(value: string) => setPrioridad(value)}
                        handleTipo={(value: string) => setTipo(value)}
                        handleCreadoPorId={(value: any) => setCreadoPorId(value)}
                        handleAsignadoAId={(value: any) => setAsignadoAId(value)}
                        handleTiempoEstimado={(value: any) =>
                            setTiempoEstimado(Number(value) || null)
                        }
                        onSave={submitEditTicket}
                        onCancel={handleCloseEdit}
                    />
                </Box>
            </Modal>
        );
    };

    const columns: GridColDef<ITicket>[] = [
        {
            field: "titulo",
            headerName: "Título",
            flex: 1,
            minWidth: 220,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => params.row.correlativo + "-" + params.value
        },
        {
            field: "tipoTicket",
            headerName: "Tipo",
            minWidth: 120,
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "descripcion",
            headerName: "Descripción",
            flex: 1,
            minWidth: 260,
            headerAlign: "left",
            align: "left",
            sortable: false,
        },
        {
            field: "estado",
            headerName: "Estado",
            minWidth: 120,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={getEstadoColor(params.value)}
                    variant="outlined"
                />
            ),
        },
        {
            field: "prioridad",
            headerName: "Prioridad",
            minWidth: 120,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={getPrioridadColor(params.value)}
                />
            ),
        },
        {
            field: "tipo",
            headerName: "Tipo de caso",
            minWidth: 130,
            flex: 1,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "creadoPor",
            headerName: "Creado por",
            minWidth: 120,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => params.row.creadoPor?.Name ?? "-",
        },
        {
            field: "asignadoA",
            headerName: "Asignado a",
            minWidth: 120,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => params.row.asignadoA?.Name ?? "-",
        },
        {
            field: "duracionCierreSeg",
            headerName: "duracion",
            minWidth: 100,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => {
                const s = Number(params.value);
                if (!s || isNaN(s)) return "-";

                const hours = Math.floor(s / 3600);
                const minutes = Math.floor((s % 3600) / 60);
                const seconds = s % 60;

                const pad = (n:any) => String(n).padStart(2, "0");
                return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
            },
        },
         {
            field: "tiempoEstimado",
            headerName: "Hr Estimada",
            minWidth: 100,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => {
                return params.value + 'h'
            }
        },
        {
            field: "activo",
            headerName: "Validado",
            minWidth: 100,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => (params.value ? "Sí" : "No"),

        },
        {
            field: "accion",
            headerName: "Acción",
            width: 200,
            flex: 0,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{
                            textTransform: "Capitalize",
                            borderRadius: "20px",
                            mr: 2
                        }}
                        onClick={() => {
                            handleOpenEdit()
                            setIdTicket(params.row.idTicket as any)
                        }}>Editar</Button>
                    {
                        userContext?.rol === "Gerente TI" && (
                            <Button
                                size="small"
                                variant="contained"
                                sx={{
                                    textTransform: "Capitalize",
                                    borderRadius: "20px"
                                }}
                                color="error"
                                onClick={() => submitFinalizarTicket(params.row.idTicket)}
                            >Finalizar</Button>
                        )
                    }
                </Box>

            ),
        },
    ];

    return (
        <>
            <AlertSanck
                open={snackbarOpen}
                handleClose={handleCloseSnackbar}
                message={snackbarMessage}
                color={snackbarColor}
            />
            {viewModal()}
            {viewEditModal()}

            <Grid container spacing={3}>
                <Grid size={12}>
                    <HeaderBox
                        title="Gestion de Ticket"
                        addButton
                        submit={handleOpen}
                    />
                </Grid>
                <Grid size={12} sx={{ mt: 5 }}>
                    <CustomDataGrid
                        columns={columns}
                        rows={ticket}
                        getRowId={(row: ITicket) => row.idTicket}
                    />
                </Grid>
            </Grid>
        </>
    );
}
