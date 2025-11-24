import React from "react";
import {
    AlertColor,
    Box,
    Chip,
    Grid,
    IconButton,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";
import HeaderBox from "../../../components/common/Header";
import { createTicket, fetchTicket, fetchUser } from "../../../service";
import { ITicket, IUser } from "../../../interfaces";
import moment from "moment";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomDataGrid from "../../../components/common/Grid";
import AddModal from "./Modals/AddModal";
import AlertSanck from "../../../components/common/Alert";


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
    const [ticket, setTicket] = React.useState<ITicket[]>();
    const [user, setUser] = React.useState<IUser[]>();
    const [open, setOpen] = React.useState<boolean>(false);

    // 🔹 Estado del formulario del modal
    const [tipoTicket, setTipoTicket] = React.useState<string>("INCIDENCIA");
    const [titulo, setTitulo] = React.useState<string>("");
    const [descripcion, setDescripcion] = React.useState<string>("");
    const [estado, setEstado] = React.useState<string>("");
    const [prioridad, setPrioridad] = React.useState<string>("");
    const [tipo, setTipo] = React.useState<string>("");
    const [creadoPorId, setCreadoPorId] = React.useState<number | string | null>(null);
    const [asignadoAId, setAsignadoAId] = React.useState<number | string | null>(null);

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
    
    const resetForm = () =>{
        setTitulo("")
        setDescripcion("")
        setEstado("")
        setPrioridad("")
        setTipo("")
        setCreadoPorId(null)
        setAsignadoAId(null)
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
                asignadoAId: Number(asignadoAId)
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getTicket();

                handleClose();
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
                        onSave={submitTilkect}
                        onCancel={handleClose}
                    />

                    {/* Aquí después puedes agregar botones Guardar / Cancelar */}
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
            minWidth: 150,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => params.row.creadoPor?.Name ?? "-",
        },
        {
            field: "asignadoA",
            headerName: "Asignado a",
            minWidth: 150,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) => params.row.asignadoA?.Name ?? "-",
        },
        {
            field: "fechaCreacion",
            headerName: "Creado",
            minWidth: 170,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) =>
                moment(params.value).format("YYYY-MM-DD HH:mm"),
        },
        {
            field: "fechaActualizacion",
            headerName: "Actualizado",
            minWidth: 170,
            flex: 1,
            headerAlign: "left",
            align: "left",
            renderCell: (params) =>
                moment(params.value).format("YYYY-MM-DD HH:mm"),
        },
        {
            field: "accion",
            headerName: "Acción",
            width: 80,
            headerAlign: "center",
            align: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Tooltip title="Editar ticket">
                    <IconButton size="small" onClick={() => console.log(params.row)}>
                        <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
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
