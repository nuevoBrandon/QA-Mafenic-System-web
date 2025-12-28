import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";

export type IRoles = "QA" | "ANALISTA" | "JEFE_DESARROLLO" | "GERENTE_TI";

interface Props {
    usuario: string;
    password: string;
    rol: string;
    status: string;
    handleUsuario: (value: string) => void
    handlePassword: (value: string) => void
    handleRol: (value: string) => void
    handleStatus: (value: string) => void

    onSave: () => void;
    onCancel?: () => void;
}
export default function EditModal({
    usuario,
    password,
    status,
    rol,
    handleUsuario,
    handlePassword,
    handleStatus,
    handleRol,
    onSave,
    onCancel
}: Props) {

    const estadoOptions: { label: string; value: IRoles }[] = [
        { label: "QA", value: "QA" },
        { label: "Analista", value: "ANALISTA" },
        { label: "Jefe de desarrollo", value: "JEFE_DESARROLLO" },
        { label: "Gerente TI", value: "GERENTE_TI" },
    ];
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Usuario"
                    variant="outlined"
                    margin="normal"
                    value={usuario ?? ""}
                    onChange={(e) => handleUsuario(e.target.value)}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    select
                    fullWidth
                    label="Estado"
                    variant="outlined"
                    margin="normal"
                    value={status ?? ""}
                    onChange={(e) => handleStatus(e.target.value as string)}
                >
                    <MenuItem value="Y">
                        Activo
                    </MenuItem>
                    <MenuItem value="N">
                        Inactivo
                    </MenuItem>

                </TextField>
            </Grid>
            <Grid size={12}>
                <TextField
                    select
                    fullWidth
                    label="Rol"
                    variant="outlined"
                    margin="normal"
                    value={rol ?? ""}
                    onChange={(e) => handleRol(e.target.value as string)}
                >
                    {estadoOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
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
    )
}