import React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../service";
import { AuthContext } from "../../Auth/AuthProvider";

export default function Login() {
    const navigate = useNavigate()
     const { login } = React.useContext(AuthContext); 
    const [user, setUser] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const handleUser = (value: string) => {
        setUser(value)
    }

    const handlePassword = (value: string) => {
        setPassword(value)
    }

    const submitLogin = async () => {
        try {
            const body = {
                Name: user,
                Password: password
            };

            const response = await signIn(body);
            const { code, data } = response;

            if (code === "000") {
                login(data.token); 
            } else {
                console.warn("Error en el inicio de sesión:", response);
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100vh" }}
        >
            <Grid size={3}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            component="div"
                            align="center"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                        >
                            Iniciar Sesión
                        </Typography>

                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Correo electrónico"
                                variant="outlined"
                                margin="normal"
                                value={user}
                                onChange={(e) => handleUser(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => handlePassword(e.target.value)}
                            />
                        </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={submitLogin}
                            style={{ textTransform: "capitalize" }}>
                            Ingresar
                        </Button>
                    </CardActions>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 2, color: "text.secondary" }}
                    >
                        ¿Olvidaste tu contraseña?
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    );
}
