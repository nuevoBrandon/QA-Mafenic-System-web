import { Button, Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface Props {
    title: string
    addButton?: boolean
    submit?: () => void
}

export default function HeaderBox({
    title,
    addButton,
    submit
}: Props) {
    return (
        <Grid container spacing={1}>
            <Grid size={10}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
            </Grid>
            {
                addButton && (
                    <Grid size={2}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            sx={{
                                borderRadius: "20px",
                                textTransform: "capitalize"
                            }}
                            variant="contained"
                            color="success"
                            onClick={() => submit?.()}
                        >
                            <AddIcon />
                            Agregar
                        </Button>
                    </Grid>
                )
            }
        </Grid>
    )
}