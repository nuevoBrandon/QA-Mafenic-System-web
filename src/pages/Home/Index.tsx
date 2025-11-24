import { Grid, Typography } from "@mui/material"

export default function Home() {
    return (
        <Grid container spacing={1}>
            <Grid size={12}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ¡Bienvenido al sistema!
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
                    QA Mafenic System está listo para empezar.
                    Usa el menú lateral para navegar entre las secciones.
                </Typography>
            </Grid>
        </Grid>
    )
}


