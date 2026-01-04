import { Box, Button, Grid, MenuItem, Paper, TextField } from "@mui/material";

interface Props {
    estado: string;
    prioridad: string;
    tipo: string;
    handleEstado: (value: string) => void;
    handlePrioridad: (value: string) => void;
    handleTipo: (value: string) => void;
    onSearch?: () => void;
}

export default function Search({
    estado,
    prioridad,
    tipo,
    handleEstado,
    handlePrioridad,
    handleTipo,
    onSearch
}: Props) {
    const estadoOptions = ["PENDIENTE", "EN_PROGRESO", "RESUELTO", "CERRADO"];
    const prioridadOptions = ["BAJA", "MEDIA", "ALTA"];
    const tipoOptions = ["Nuevo desarrollo", "Mejora", "Bug", "Soporte"];
    return (

        <Paper variant="elevation" sx={{ p: 4, width: '100%' }}>
            <Grid container spacing={3} sx={{
                alignContent: "center",
                alignItems: "center"
            }}>
                <Grid size={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Estado"
                        variant="outlined"
                        margin="normal"
                        value={estado}
                        onChange={(e) => handleEstado(e.target.value)}
                    >
                        <MenuItem value="">Todo</MenuItem>
                        {estadoOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Prioridad"
                        variant="outlined"
                        margin="normal"
                        value={prioridad}
                        onChange={(e) => handlePrioridad(e.target.value)}
                    >
                        <MenuItem value="">Todo</MenuItem>
                        {prioridadOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={2}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Tipo"
                        variant="outlined"
                        margin="normal"
                        value={tipo}
                        onChange={(e) => handleTipo(e.target.value)}

                    > <MenuItem value="">Todo</MenuItem>
                        {tipoOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={4}></Grid>
                <Grid size={2}>
                    <Box display="flex" justifyContent="end">
                        <Button
                            variant="contained"
                            color="info"
                            onClick={onSearch}
                            sx={{ borderRadius: '20px', textTransform: "capitalize" }}
                        >
                            Buscar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}