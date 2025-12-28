import { AlertColor, Box, Chip, Grid, IconButton, Modal, Typography } from "@mui/material";
import HeaderBox from "../../../components/common/Header";
import { GridColDef } from "@mui/x-data-grid";
import CustomDataGrid from "../../../components/common/Grid";
import React from "react";
import { IUser } from "../../../interfaces";
import { createUser, fetchUser, findOneUser, updateUser } from "../../../service";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import AddModal from "./Modals/AddMoal";
import AlertSanck from "../../../components/common/Alert";
import { AuthContext } from "../../../Auth/AuthProvider";
import EditModal from "./Modals/EditModal";

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

export default function User() {
    const { user: userContext } = React.useContext<any>(AuthContext);
    const [users, setUsers] = React.useState<IUser[]>()
    const [usuario, setUsuario] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [rol, setRol] = React.useState<string>("")
    const [status, setStatus] = React.useState<string>("")
    const [open, setOpen] = React.useState<boolean>(false)
    const [openEdit, setOpenEdit] = React.useState<boolean>(false)
    const [usersId, setUsersId] = React.useState<any>()

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState<AlertColor>("success");


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleUsuario = (value: string) => setUsuario(value)
    const handlePassword = (value: string) => setPassword(value)
    const handleRol = (value: string) => setRol(value)
    const handleStatus = (value: string) => setStatus(value)
    const handleCloseSnackbar = () => setSnackbarOpen(false);

    const resetForm = () => {
        setUsuario("")
        setPassword("")
        setRol("")
        setStatus("")
    }

    React.useEffect(() => {
        getUser()
    }, [])

    React.useEffect(() => {
        if (usersId) {
            getOneUser(usersId)
        }

    }, [usersId])

    const getUser = async () => {
        try {
            const response = await fetchUser()
            const { code, data } = response
            if (code === '000') {
                setUsers(data as IUser[])
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const getOneUser = async (usersId: any) => {
        try {
            const response = await findOneUser(usersId)
            const { code, data } = response
            if (code === '000') {
                setUsuario(data.Name)
                setStatus(data.Active as string)
                setRol(data.Rol)
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const submitUser = async () => {
        try {
            const response = await createUser({
                Name: usuario,
                Rol: rol,
                Password: password
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getUser()

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


    const submitUpdate = async () => {
        try {
            const response = await updateUser(usersId, {
                Name: usuario,
                Active: status,
                Rol: rol
            })
            const { code, data, message } = response;
            if (code === "000") {
                await getUser()

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


    const handleEdit = (value: any) => {
        setUsersId(value.IdUser)
    }

    const viewModal = () => {
        return (
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        Nuevo Usuario
                    </Typography>
                    <AddModal
                        usuario={usuario}
                        password={password}
                        rol={rol}
                        handleUsuario={handleUsuario}
                        handlePassword={handlePassword}
                        handleRol={handleRol}
                        onSave={submitUser}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        );
    };

    const viewModalEdit = () => {
        return (
            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>
                        Editar Usuario
                    </Typography>
                    <EditModal
                        status={status}
                        usuario={usuario}
                        password={password}
                        rol={rol}
                        handleStatus={handleStatus}
                        handleUsuario={handleUsuario}
                        handlePassword={handlePassword}
                        handleRol={handleRol}
                        onSave={submitUpdate}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        );
    };


    const columns = React.useMemo<GridColDef<IUser>[]>(
        () => [
            {
                field: "Name",
                headerName: "Usuario",
                flex: 1,
                minWidth: 150,
                headerAlign: "center",
                align: "center",
            },
            {
                field: "Rol",
                headerName: "Rol",
                flex: 1,
                minWidth: 130,
                headerAlign: "center",
                align: "center",
            },
            {
                field: "Active",
                headerName: "Estado",
                flex: 1,
                minWidth: 130,
                headerAlign: "center",
                align: "center",
                renderCell: (params) => (
                    <Chip
                        label={params.value === "Y" ? "Activo" : "Inactivo"}
                        size="small"
                        color={params.value === "Y" ? "success" : "default"}
                    />
                ),
            },
            {
                field: "CreateDate",
                headerName: "Fecha de creación",
                flex: 1,
                minWidth: 190,
                headerAlign: "center",
                align: "center",
                renderCell: (params) =>
                    params.value ? moment(params.value).format("YYYY-MM-DD HH:mm") : "-",
            },
            {
                field: "accion",

                headerName: "Acción",
                sortable: false,
                filterable: false,
                flex: 0.5,
                minWidth: 90,
                headerAlign: "center",
                align: "center",
                renderCell: (params) => (
                    <IconButton
                        size="small"
                        onClick={() => {
                            setOpenEdit(true)
                            handleEdit(params.row)
                        }}
                        disabled={!(userContext?.rol === "GERENTE_TI" || userContext?.rol === "ANALISTA")}
                    >
                        <EditIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                ),
            },
        ],
        []
    );


    return (
        <>
            <AlertSanck
                open={snackbarOpen}
                handleClose={handleCloseSnackbar}
                message={snackbarMessage}
                color={snackbarColor}
            />
            <Grid container spacing={3}>
                <Grid size={12}>
                    <HeaderBox
                        title="Usuarios"
                        addButton={userContext?.rol === "GERENTE_TI"}
                        submit={handleOpen}
                    />
                </Grid>
                <Grid size={12} sx={{ mt: 5 }}>
                    <CustomDataGrid
                        columns={columns}
                        rows={users}
                        getRowId={(row: IUser) => row?.IdUser}
                    />
                </Grid>
                {viewModal()}
                {viewModalEdit()}
            </Grid>
        </>
    )
}