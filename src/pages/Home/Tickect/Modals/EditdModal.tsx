import { Grid, TextField, MenuItem, Button, Autocomplete } from "@mui/material";
import { IUser } from "../../../../interfaces";

interface Props {
    tipoTicket: string;
    titulo: string;
    descripcion: string;
    estado: string;
    prioridad: string;
    tipo: string;
    tiempoEstimado: number | null;
    creadoPorId: number | string;
    asignadoAId: number | string | null;

    user: IUser[]

    handleTipoTicket: (value: string) => void;
    handleTitle: (value: string) => void;
    handleDescripcion: (value: string) => void;
    handleEstado: (value: string) => void;
    handleTiempoEstimado: (value: number | null) => void;
    handlePrioridad: (value: string) => void;
    handleTipo: (value: string) => void;
    handleCreadoPorId: (value: number | string) => void;
    handleAsignadoAId: (value: number | string | null) => void;

    onSave: () => void;
    onCancel?: () => void;
}

export default function EditdModal({
    tipoTicket,
    titulo,
    descripcion,
    estado,
    prioridad,
    tipo,
    user,
    creadoPorId,
    asignadoAId,
    tiempoEstimado,
    handleTipoTicket,
    handleTitle,
    handleDescripcion,
    handleEstado,
    handleTiempoEstimado,
    handlePrioridad,
    handleTipo,
    handleCreadoPorId,
    handleAsignadoAId,
    onSave,
    onCancel,
}: Props) {
    const estadoOptions = ["PENDIENTE", "EN_PROGRESO", "RESUELTO", "CERRADO","ABIERTO"];
    const prioridadOptions = ["BAJA", "MEDIA", "ALTA"];
    const tipoOptions = ["Nuevo desarrollo", "Mejora", "Bug", "Soporte"];
    const selectedCreador = user.find((u) => u.IdUser === creadoPorId) ?? null;
    const selectedAsignado = user.find((u) => String(u.IdUser) === String(asignadoAId)) ?? null;

    return (
        <Grid container spacing={2}>
            {/* Tipo de ticket (SELECT) */}
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Tipo de ticket"
                    variant="outlined"
                    margin="normal"
                    disabled
                    value={tipoTicket ?? ""}
                    onChange={(e) => handleTipoTicket(e.target.value)}
                />
            </Grid>

            {/* Título */}
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Título"
                    variant="outlined"
                    margin="normal"
                    value={titulo}
                    onChange={(e) => handleTitle(e.target.value)}
                />
            </Grid>

            {/* Descripción */}
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Descripción"
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={4}
                    value={descripcion}
                    onChange={(e) => handleDescripcion(e.target.value)}
                />
            </Grid>

            {/* Estado (SELECT) */}
            <Grid size={4}>
                <TextField
                    select
                    fullWidth
                    label="Estado"
                    variant="outlined"
                    margin="normal"
                    value={estado}
                    onChange={(e) => handleEstado(e.target.value)}
                >
                    {estadoOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            {/* Prioridad (SELECT) */}
            <Grid size={4}>
                <TextField
                    select
                    fullWidth
                    label="Prioridad"
                    variant="outlined"
                    margin="normal"
                    value={prioridad}
                    onChange={(e) => handlePrioridad(e.target.value)}
                >
                    {prioridadOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid size={4}>
                <TextField
                    fullWidth
                    type="number"
                    label="Tiempo Estimado (hrs)"
                    variant="outlined"
                    margin="normal"
                    value={tiempoEstimado ?? null}
                    onChange={(e) => handleTiempoEstimado(e.target.value as any)}
                    />
            </Grid>

            {/* Tipo (SELECT) */}
            <Grid size={12}>
                <TextField
                    select
                    fullWidth
                    label="Tipo"
                    variant="outlined"
                    margin="normal"
                    value={tipo}
                    onChange={(e) => handleTipo(e.target.value)}
                >
                    {tipoOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            {/* Creado por ID */}
            <Grid size={6}>
                <Autocomplete
                    options={user}
                    value={selectedCreador as any}
                    getOptionLabel={(option: IUser) => `${option.Name} - ${option.Rol}`}
                    onChange={(_, newValue: IUser | null) => {

                        handleCreadoPorId(newValue ? newValue.IdUser : "");
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Creado Por"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.IdUser === value.IdUser}
                />
            </Grid>
            {/* Asignado a ID (opcional) */}
            <Grid size={6}>
                <Autocomplete
                    options={user}
                    value={selectedAsignado}
                    onChange={(_, newValue: IUser | null) => {
                        // si limpian el campo, queda sin asignar (null)
                        handleAsignadoAId(newValue ? newValue.IdUser : null);
                    }}
                    getOptionLabel={(option: IUser) => `${option.Name} - ${option.Rol}`}
                    isOptionEqualToValue={(option, value) =>
                        String(option.IdUser) === String(value.IdUser)
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Asignado a (opcional)"
                            variant="outlined"
                            margin="normal"
                        />
                    )}
                />
            </Grid>

            {/* Botones */}
            <Grid
                size={12}
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                }}
            >
                {onCancel && (
                    <Button
                        variant="contained"
                        onClick={onCancel}
                        color="error"
                        sx={{
                            borderRadius: "20px",
                            textTransform: "capitalize"
                        }}
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={onSave}
                    sx={{
                        borderRadius: "20px",
                        textTransform: "capitalize"
                    }}
                >
                    Guardar
                </Button>
            </Grid>
        </Grid>
    );
}
