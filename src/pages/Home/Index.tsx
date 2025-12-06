import { Box, Divider, Grid, Paper, Typography } from "@mui/material"


export default function Home() {
    return (
        <Grid container spacing={3}>
            {/* BANNER PRINCIPAL */}
            <Grid size={12}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        component="img"
                        src="../Fachada-ProEmpresa-2.png"
                        alt="Fachada Financiera ProEmpresa"
                        sx={{
                            width: "100%",
                            display: "block",
                            maxHeight: 260,
                            objectFit: "cover",
                        }}
                    />
                </Paper>
            </Grid>

            {/* Título y descripción */}
            <Grid size={12}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Typography variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "#79c094ff"
                        }}>
                        ¡Bienvenido al sistema!
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 1.5,
                            color: "text.secondary"
                        }}
                    >
                        Financiera ProEmpresa tiene como accionista principal a la
                        Asociación de Institutos de Desarrollo del Sector Informal (IDESI),
                        conformada por instituciones pioneras en brindar créditos a miles de
                        emprendedores desde 1986 en 19 regiones del país.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Aquí podrás gestionar la información de clientes, operaciones y
                        procesos de forma ágil y segura.
                    </Typography>
                </Paper>
            </Grid>

            {/* Visión */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        height: "100%",
                        backgroundColor: "background.paper",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600,color:"#79c094ff" }}>
                            Visión
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        "Ser el banco preferido por los emprendedores de micro y pequeña
                        empresa, reconocidos por nuestra calidad en la atención al cliente,
                        innovación y compromiso social".
                    </Typography>
                </Paper>
            </Grid>

            {/* Misión */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        height: "100%",
                        backgroundColor: "background.paper",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color:"#79c094ff" }}>
                            Misión
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        "Brindar servicios y productos financieros especializados,
                        fomentando la inclusión y el desarrollo de nuestros clientes y sus
                        familias".
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
