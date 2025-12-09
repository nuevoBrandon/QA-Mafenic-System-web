import React from "react"
import { ITicket } from "../../../interfaces"
import { fetchTicket } from "../../../service"
import {
    Grid,
    Paper,
    Typography,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"
import HeaderBox from "../../../components/common/Header"

// IMPORTS DEL GRÁFICO
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
    LabelList,
} from "recharts"

// 🔹 Helper para porcentaje
const getPercentage = (value: number, total: number): string => {
    if (!total) return "0%"
    return `${((value * 100) / total).toFixed(1)}%`
}

// 🔹 Helper para contar tickets por estado en los últimos N días
const countTicketsByEstadoInLastDays = (
    tickets: ITicket[],
    estado: string,
    days: number
): number => {
    const now = new Date()
    const from = new Date()
    from.setDate(now.getDate() - days)

    return tickets.filter((t) => {
        if (t.estado !== estado) return false
        const fecha = new Date((t as any).fechaActualizacion || t.fechaCreacion)
        return fecha >= from && fecha <= now
    }).length
}

export default function Dashboard() {
    const [tickets, setTickets] = React.useState<ITicket[]>([])

    // 🔹 Estado para filtrar por estado de ticket (dashboard individual por estado)
    const [estadoSeleccionado, setEstadoSeleccionado] = React.useState<
        "TODOS" | "ABIERTO" | "PENDIENTE" | "EN_PROGRESO" | "CERRADO"
    >("TODOS")

    React.useEffect(() => {
        getTicket()
    }, [])

    const getTicket = async () => {
        try {
            const response = await fetchTicket()
            const { code, data } = response
            if (code === "000") {
                setTickets(data as ITicket[])
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const StatCard = ({
        title,
        value,
        subtitle,
        chartData,
    }: {
        title: string
        value: number | string
        subtitle?: string
        chartData?: { name: string; value: number; color?: string }[]
    }) => {
        const DEFAULT_COLORS = ["#1976d2", "#e0e0e0", "#43a047", "#fb8c00"]

        return (
            <Paper elevation={3} sx={{ p: 2.5, height: "100%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}

                {chartData && chartData.length > 0 && (
                    <Box sx={{ mt: 2, height: 120 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={60}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${entry.name}`}
                                            fill={
                                                entry.color ||
                                                DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Paper>
        )
    }

    // 🔹 Tickets filtrados según el estado seleccionado
    const ticketsFiltrados = React.useMemo(
        () =>
            estadoSeleccionado === "TODOS"
                ? tickets
                : tickets.filter((t) => t.estado === estadoSeleccionado),
        [tickets, estadoSeleccionado]
    )

    // 🔹 Contadores basados en tickets filtrados
    const totalTickets = ticketsFiltrados.length
    const abiertos = ticketsFiltrados.filter((t) => t.estado === "ABIERTO").length
    const pendientes = ticketsFiltrados.filter((t) => t.estado === "PENDIENTE").length
    const enProgreso = ticketsFiltrados.filter((t) => t.estado === "EN_PROGRESO").length
    const cerrados = ticketsFiltrados.filter((t) => t.estado === "CERRADO").length
    const sinAsignar = ticketsFiltrados.filter((t) => !t.asignadoAId).length

    const incidencias = ticketsFiltrados.filter(
        (t) => t.tipoTicket === "INCIDENCIA"
    ).length

    // 🔹 Tickets por prioridad (filtrados)
    const alta = ticketsFiltrados.filter((t) => t.prioridad === "ALTA").length
    const media = ticketsFiltrados.filter((t) => t.prioridad === "MEDIA").length
    const baja = ticketsFiltrados.filter((t) => t.prioridad === "BAJA").length

    const dataPrioridad = [
        { name: "Alta", value: alta },
        { name: "Media", value: media },
        { name: "Baja", value: baja },
    ]

    // 🔹 Tickets por tipoTicket (INCIDENCIA / REQUERIMIENTO / etc)
    const tiposTicketMap = ticketsFiltrados.reduce<Record<string, number>>(
        (acc, t) => {
            acc[t.tipoTicket] = (acc[t.tipoTicket] || 0) + 1
            return acc
        },
        {}
    )

    const dataTipoTicket = Object.entries(tiposTicketMap).map(([name, value]) => ({
        name,
        value,
    }))

    // 🔹 Tickets por asignado (carga de trabajo + porcentaje)
    const totalTicketsAsignacion = ticketsFiltrados.length

    const asignadoMap = ticketsFiltrados.reduce<Record<string, number>>((acc, t) => {
        const key = t.asignadoA ? t.asignadoA.Name : "Sin asignar"
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})

    const dataPorAsignado = Object.entries(asignadoMap).map(([name, value]) => {
        const porcentajeNumber = totalTicketsAsignacion
            ? Number(((value * 100) / totalTicketsAsignacion).toFixed(1))
            : 0

        return {
            name,
            value,
            porcentaje: porcentajeNumber,
            porcentajeLabel: `${porcentajeNumber}%`,
        }
    })

    // 🔹 Datos para el gráfico de barras (tickets por estado)
    const dataEstado = [
        { name: "Abiertos", value: abiertos },
        { name: "En progreso", value: enProgreso },
        { name: "Pendientes", value: pendientes },
        { name: "Cerrados", value: cerrados },
    ]

    // 🔹 Últimos tickets ordenados por fecha (filtrados)
    const ultimosTickets = [...ticketsFiltrados]
        .sort(
            (a, b) =>
                new Date(b.fechaCreacion).getTime() -
                new Date(a.fechaCreacion).getTime()
        )
        .slice(0, 5)

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "ABIERTO":
                return "error"
            case "PENDIENTE":
                return "warning"
            case "EN_PROGRESO":
                return "info"
            case "CERRADO":
                return "success"
            default:
                return "default"
        }
    }

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case "ALTA":
                return "error"
            case "MEDIA":
                return "warning"
            case "BAJA":
                return "success"
            default:
                return "default"
        }
    }

    const colorByEstado: Record<string, string> = {
        Abiertos: "#e53935", // rojo
        "En progreso": "#3949ab", // azul
        Pendientes: "#fb8c00", // naranja
        Cerrados: "#43a047", // verde
    }

    // 🔹 Porcentajes por estado (sobre el total filtrado)
    const pctAbiertos = getPercentage(abiertos, totalTickets)
    const pctPendientes = getPercentage(pendientes, totalTickets)
    const pctSinAsignar = getPercentage(sinAsignar, totalTickets)
    const pctCerrados = getPercentage(cerrados, totalTickets)

    // 🔹 Tickets aprobados (CERRADO) en los últimos 15 días (sobre TODOS los tickets)
    const aprobadosUltimos15Dias = countTicketsByEstadoInLastDays(
        tickets,
        "CERRADO",
        15
    )

    const pctAprobadosUltimos15Dias = getPercentage(
        aprobadosUltimos15Dias,
        tickets.length || 1
    )

    // 🔹 Tickets CERRADOS (GLOBAL) validados vs no validados
    const ticketsCerradosGlobal = tickets.filter((t) => t.estado === "CERRADO")
    const totalCerradosGlobal = ticketsCerradosGlobal.length

    const ticketsCerradosValidados = ticketsCerradosGlobal.filter(
        (t) => t.activo === true
    ).length

    const ticketsCerradosNoValidados = ticketsCerradosGlobal.filter(
        (t) => t.activo === false
    ).length

    const pctValidadosCerrados = getPercentage(
        ticketsCerradosValidados,
        totalCerradosGlobal || 1
    )

    const pctNoValidadosCerrados = getPercentage(
        ticketsCerradosNoValidados,
        totalCerradosGlobal || 1
    )

    const dataValidacionCerrados = [
        { name: "Validados", value: ticketsCerradosValidados },
        { name: "No validados", value: ticketsCerradosNoValidados },
    ]

    // 🔹 Tooltip personalizado para el gráfico de responsables
    const CustomTooltipAsignado = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const { value, porcentaje } = payload[0].payload
            return (
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: 4,
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
                    <p style={{ margin: "4px 0 0" }}>Tickets: {value}</p>
                    <p style={{ margin: 0 }}>Porcentaje: {porcentaje}%</p>
                </div>
            )
        }
        return null
    }

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <HeaderBox title="Dashboard" />

                {/* 🔹 Filtros por estado (dashboard individual por estado) */}
                <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        label="Todos"
                        variant={estadoSeleccionado === "TODOS" ? "filled" : "outlined"}
                        color="primary"
                        onClick={() => setEstadoSeleccionado("TODOS")}
                    />
                    <Chip
                        label="Abiertos"
                        variant={estadoSeleccionado === "ABIERTO" ? "filled" : "outlined"}
                        color="error"
                        onClick={() => setEstadoSeleccionado("ABIERTO")}
                    />
                    <Chip
                        label="En progreso"
                        variant={
                            estadoSeleccionado === "EN_PROGRESO" ? "filled" : "outlined"
                        }
                        color="info"
                        onClick={() => setEstadoSeleccionado("EN_PROGRESO")}
                    />
                    <Chip
                        label="Pendientes"
                        variant={
                            estadoSeleccionado === "PENDIENTE" ? "filled" : "outlined"
                        }
                        color="warning"
                        onClick={() => setEstadoSeleccionado("PENDIENTE")}
                    />
                    <Chip
                        label="Cerrados"
                        variant={estadoSeleccionado === "CERRADO" ? "filled" : "outlined"}
                        color="success"
                        onClick={() => setEstadoSeleccionado("CERRADO")}
                    />
                </Box>

                <Grid container spacing={2}>
                    {/* Total de tickets -> distribución por estado */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <StatCard
                            title="Total de tickets"
                            value={totalTickets}
                            subtitle={
                                estadoSeleccionado === "TODOS"
                                    ? "Mostrando todos los estados"
                                    : `Mostrando solo estado: ${estadoSeleccionado}`
                            }
                            chartData={[
                                { name: "Abiertos", value: abiertos, color: "#e53935" },
                                { name: "En progreso", value: enProgreso, color: "#3949ab" },
                                { name: "Pendientes", value: pendientes, color: "#fb8c00" },
                                { name: "Cerrados", value: cerrados, color: "#43a047" },
                            ]}
                        />
                    </Grid>

                    {/* Abiertos -> abiertos vs resto */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <StatCard
                            title="Tickets abiertos"
                            value={`${abiertos} (${pctAbiertos})`}
                            chartData={[
                                { name: "Abiertos", value: abiertos, color: "#e53935" },
                                {
                                    name: "Otros",
                                    value: Math.max(totalTickets - abiertos, 0),
                                    color: "#e0e0e0",
                                },
                            ]}
                        />
                    </Grid>

                    {/* Pendientes -> pendientes vs resto */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <StatCard
                            title="Tickets pendientes"
                            value={`${pendientes} (${pctPendientes})`}
                            chartData={[
                                { name: "Pendientes", value: pendientes, color: "#fb8c00" },
                                {
                                    name: "Otros",
                                    value: Math.max(totalTickets - pendientes, 0),
                                    color: "#e0e0e0",
                                },
                            ]}
                        />
                    </Grid>

                    {/* Sin asignar -> sin asignar vs con asignar */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <StatCard
                            title="Sin asignar"
                            value={`${sinAsignar} (${pctSinAsignar})`}
                            chartData={[
                                { name: "Sin asignar", value: sinAsignar, color: "#8e24aa" },
                                {
                                    name: "Asignados",
                                    value: Math.max(totalTickets - sinAsignar, 0),
                                    color: "#e0e0e0",
                                },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Grid>

            {/* Segunda fila: stats + gráfico de barras */}
            <Grid size={12} sx={{ mt: 6 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={2} rowSpacing={6}>
                            <Grid size={12}>
                                <StatCard
                                    title="Incidencias"
                                    value={incidencias}
                                    subtitle="tipoTicket = INCIDENCIA"
                                />
                            </Grid>
                            <Grid size={12}>
                                <StatCard
                                    title="Cerrados"
                                    value={`${cerrados} (${pctCerrados})`}
                                />
                            </Grid>
                            <Grid size={12}>
                                <StatCard
                                    title="Tickets aprobados últimos 15 días"
                                    value={`${aprobadosUltimos15Dias} (${pctAprobadosUltimos15Dias})`}
                                    subtitle="Estado = CERRADO en los últimos 15 días"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 📊 GRÁFICO DE BARRAS POR RESPONSABLE */}
                    <Grid size={8}>
                        <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Tickets por responsable (asignado)
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataPorAsignado}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip content={<CustomTooltipAsignado />} />
                                    <Legend />
                                    <Bar dataKey="value" name="Tickets">
                                        {dataPorAsignado.map((item, index) => (
                                            <Cell
                                                key={`cell-asignado-${item.name}`}
                                                fill={
                                                    ["#1976d2", "#43a047", "#fb8c00", "#8e24aa"][
                                                    index % 4
                                                    ]
                                                }
                                            />
                                        ))}
                                        <LabelList dataKey="porcentajeLabel" position="top" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>

            {/* Fila: pies prioridad y tipoTicket */}
            <Grid size={12} sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {/* Gráfico de tickets por prioridad */}
                    <Grid size={3}>
                        <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Tickets por prioridad
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPrioridad}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                        label
                                    >
                                        {dataPrioridad.map((entry, index) => (
                                            <Cell
                                                key={`cell-prioridad-${entry.name}`}
                                                fill={["#e53935", "#fb8c00", "#43a047"][index % 3]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid size={3}>
                        <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Validación de tickets cerrados
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Total cerrados: {totalCerradosGlobal} | Validados:{" "}
                                {ticketsCerradosValidados} ({pctValidadosCerrados}) | No validados:{" "}
                                {ticketsCerradosNoValidados} ({pctNoValidadosCerrados})
                            </Typography>

                            {totalCerradosGlobal === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No hay tickets cerrados para mostrar.
                                </Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataValidacionCerrados}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={90}
                                            label
                                        >
                                            <Cell key="validados" fill="#43a047" />
                                            <Cell key="no-validados" fill="#e53935" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </Paper>
                    </Grid>
                    {/* Gráfico de tickets por estado */}
                    <Grid size={6}>
                        <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Tickets por estado
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataEstado}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Cantidad">
                                        {dataEstado.map((item) => (
                                            <Cell
                                                key={`cell-${item.name}`}
                                                fill={colorByEstado[item.name] || "#1976d2"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>




            {/* Tabla de últimos tickets */}
            <Grid size={12} sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 2.5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">Últimos tickets</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Mostrando {ultimosTickets.length} de {totalTickets}
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Título</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Prioridad</TableCell>
                                    <TableCell>Creado por</TableCell>
                                    <TableCell>Asignado a</TableCell>
                                    <TableCell>Fecha creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ultimosTickets.map((ticket) => (
                                    <TableRow key={ticket.idTicket} hover>
                                        <TableCell>{ticket.idTicket}</TableCell>
                                        <TableCell>{ticket.titulo}</TableCell>
                                        <TableCell>{ticket.tipoTicket}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={ticket.estado}
                                                color={getEstadoColor(ticket.estado) as any}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={ticket.prioridad}
                                                color={getPrioridadColor(ticket.prioridad) as any}
                                            />
                                        </TableCell>
                                        <TableCell>{ticket.creadoPor?.Name}</TableCell>
                                        <TableCell>
                                            {ticket.asignadoA ? (
                                                ticket.asignadoA.Name
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Sin asignar
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(ticket.fechaCreacion).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {ultimosTickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                No hay tickets registrados.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    )
}
