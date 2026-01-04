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

// ✅ Helper robusto: sin asignar si NO hay objeto asignado o asignadoAId es 0/"0"
const isSinAsignar = (t: any): boolean => {
  if (t.asignadoA == null) return true
  const id = Number(t.asignadoAId)
  if (!isNaN(id) && id === 0) return true
  return false
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

// 🔹 Helper para formatear duración en segundos a "Xd HH:mm:ss" o "HH:mm:ss"
const formatDuration = (seconds?: number | null) => {
  const s = Number(seconds)
  if (!s || isNaN(s)) return "-"

  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const secs = s % 60

  const pad = (n: number) => String(n).padStart(2, "0")
  return days > 0
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

export default function Dashboard() {
  const [tickets, setTickets] = React.useState<ITicket[]>([])

  // 🔹 Estado para filtrar por estado de ticket (sin ABIERTO)
  const [estadoSeleccionado, setEstadoSeleccionado] = React.useState<
    "TODOS" | "PENDIENTE" | "EN_PROGRESO" | "RESUELTO" | "CERRADO"
  >("TODOS")

  React.useEffect(() => {
    getTicket()
  }, [])

  const getTicket = async () => {
    try {
      const response = await fetchTicket({
                activo: undefined,
                estado:"",
                prioridad:"",
                tipo:"" 
            })
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
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={60}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
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

  // 🔹 Tickets filtrados según estado seleccionado
  const ticketsFiltrados = React.useMemo(
    () =>
      estadoSeleccionado === "TODOS"
        ? tickets
        : tickets.filter((t) => t.estado === estadoSeleccionado),
    [tickets, estadoSeleccionado]
  )

  // 🔹 Contadores (sin ABIERTO)
  const totalTickets = ticketsFiltrados.length
  const pendientes = ticketsFiltrados.filter((t) => t.estado === "PENDIENTE").length
  const enProgreso = ticketsFiltrados.filter((t) => t.estado === "EN_PROGRESO").length
  const resueltos = ticketsFiltrados.filter((t) => t.estado === "RESUELTO").length
  const cerrados = ticketsFiltrados.filter((t) => t.estado === "CERRADO").length

  // ✅ FIX: ahora sí cuenta "0" / 0 / null / undefined
  const sinAsignar = ticketsFiltrados.filter(isSinAsignar).length

  const incidencias = ticketsFiltrados.filter((t) => t.tipoTicket === "INCIDENCIA").length

  // 🔹 Tickets por prioridad
  const alta = ticketsFiltrados.filter((t) => t.prioridad === "ALTA").length
  const media = ticketsFiltrados.filter((t) => t.prioridad === "MEDIA").length
  const baja = ticketsFiltrados.filter((t) => t.prioridad === "BAJA").length

  const dataPrioridad = [
    { name: "Alta", value: alta },
    { name: "Media", value: media },
    { name: "Baja", value: baja },
  ]

  // 🔹 Tickets por tipoTicket
  const tiposTicketMap = ticketsFiltrados.reduce<Record<string, number>>((acc, t) => {
    acc[t.tipoTicket] = (acc[t.tipoTicket] || 0) + 1
    return acc
  }, {})
  const dataTipoTicket = Object.entries(tiposTicketMap).map(([name, value]) => ({
    name,
    value,
  }))

  // 🔹 Tickets por asignado
  const totalTicketsAsignacion = ticketsFiltrados.length
  const asignadoMap = ticketsFiltrados.reduce<Record<string, number>>((acc, t: any) => {
    const key = isSinAsignar(t) ? "Sin asignar" : t.asignadoA?.Name || "Sin asignar"
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

  // 🔹 Datos para el gráfico de barras (tickets por estado) - sin ABIERTO
  const dataEstado = [
    { name: "En progreso", value: enProgreso },
    { name: "Pendientes", value: pendientes },
    { name: "Resueltos", value: resueltos },
    { name: "Cerrados", value: cerrados },
  ]

  const colorByEstado: Record<string, string> = {
    "En progreso": "#3949ab",
    Pendientes: "#fb8c00",
    Resueltos: "#00acc1",
    Cerrados: "#43a047",
  }

  // 🔹 Últimos tickets por fecha
  const ultimosTickets = [...ticketsFiltrados]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "warning"
      case "EN_PROGRESO":
        return "info"
      case "RESUELTO":
        return "secondary"
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

  // 🔹 Porcentajes
  const pctPendientes = getPercentage(pendientes, totalTickets)
  const pctSinAsignar = getPercentage(sinAsignar, totalTickets)
  const pctCerrados = getPercentage(cerrados, totalTickets)

  // 🔹 CERRADOS últimos 15 días (sobre todos los tickets)
  const cerradosUltimos15Dias = countTicketsByEstadoInLastDays(tickets, "CERRADO", 15)
  const pctCerradosUltimos15Dias = getPercentage(cerradosUltimos15Dias, tickets.length || 1)

  // 🔹 Validación de tickets cerrados (global)
  const ticketsCerradosGlobal = tickets.filter((t) => t.estado === "CERRADO")
  const totalCerradosGlobal = ticketsCerradosGlobal.length

  const ticketsCerradosValidados = ticketsCerradosGlobal.filter((t) => t.activo === true).length
  const ticketsCerradosNoValidados = ticketsCerradosGlobal.filter((t) => t.activo === false).length

  const pctValidadosCerrados = getPercentage(ticketsCerradosValidados, totalCerradosGlobal || 1)
  const pctNoValidadosCerrados = getPercentage(ticketsCerradosNoValidados, totalCerradosGlobal || 1)

  const dataValidacionCerrados = [
    { name: "Validados", value: ticketsCerradosValidados },
    { name: "No validados", value: ticketsCerradosNoValidados },
  ]

  // 🔹 Métricas de tiempo de cierre (sobre cerrados del filtro actual)
  const cerradosConDuracion = ticketsFiltrados.filter(
    (t: any) => t.estado === "CERRADO" && typeof t.duracionCierreSeg === "number"
  ) as any[]

  const duraciones = cerradosConDuracion
    .map((t) => Number(t.duracionCierreSeg))
    .filter((n) => !isNaN(n) && n > 0)
    .sort((a, b) => a - b)

  const avgDur = duraciones.length
    ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length)
    : 0

  const minDur = duraciones.length ? duraciones[0] : 0
  const maxDur = duraciones.length ? duraciones[duraciones.length - 1] : 0

  const medianDur = duraciones.length
    ? duraciones.length % 2 === 1
      ? duraciones[Math.floor(duraciones.length / 2)]
      : Math.round((duraciones[duraciones.length / 2 - 1] + duraciones[duraciones.length / 2]) / 2)
    : 0

  // 🔹 Tooltip personalizado para responsables
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

  // 🔹 Duración para mostrar (si cerrado usa duracionCierreSeg, si no => tiempo corriendo)
  const getDuracionParaMostrar = (ticket: any) => {
    if (ticket.estado === "CERRADO") return formatDuration(ticket.duracionCierreSeg)
    const transcurridoSeg = Math.floor(
      (Date.now() - new Date(ticket.fechaCreacion).getTime()) / 1000
    )
    return formatDuration(transcurridoSeg)
  }

  // ✅ Duración real (en segundos): si está cerrado usa duracionCierreSeg, si no usa transcurrido
  const getDuracionRealSeg = (ticket: any): number | null => {
    if (ticket.estado === "CERRADO") {
      const s = Number(ticket.duracionCierreSeg)
      return Number.isFinite(s) && s >= 0 ? s : null
    }
    const created = new Date(ticket.fechaCreacion).getTime()
    if (!Number.isFinite(created)) return null
    const transcurridoSeg = Math.floor((Date.now() - created) / 1000)
    return transcurridoSeg >= 0 ? transcurridoSeg : 0
  }

  // ✅ Estimado en segundos (asumiendo tiempoEstimado = horas)
  const getEstimadoSeg = (ticket: any): number | null => {
    const h = Number(ticket.tiempoEstimado)
    if (!Number.isFinite(h) || h <= 0) return null
    return Math.round(h * 3600)
  }

  // ✅ Ranking: más rápidos vs estimado y más lentos vs estimado (Top 5)
  const rankingPorEstimado = React.useMemo(() => {
    const base = ticketsFiltrados
      // Si quieres SOLO CERRADOS, descomenta:
      // .filter((t: any) => t.estado === "CERRADO")
      .map((t: any) => {
        const durRealSeg = getDuracionRealSeg(t)
        const estSeg = getEstimadoSeg(t)
        if (durRealSeg == null || estSeg == null) return null

        return {
          ...t,
          durRealSeg,
          estSeg,
          deltaSeg: durRealSeg - estSeg, // (+) se pasó, (-) antes
        }
      })
      .filter(Boolean) as any[]

    const menoresAlEstimado = [...base]
      .filter((t) => t.deltaSeg <= 0)
      .sort((a, b) => a.deltaSeg - b.deltaSeg) // más negativo = más rápido vs estimado
      .slice(0, 5)

    const mayoresAlEstimado = [...base]
      .filter((t) => t.deltaSeg > 0)
      .sort((a, b) => b.deltaSeg - a.deltaSeg) // más positivo = peor
      .slice(0, 5)

    return { menoresAlEstimado, mayoresAlEstimado }
  }, [ticketsFiltrados])

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <HeaderBox title="Dashboard" />

        {/* 🔹 Filtros por estado (sin ABIERTO) */}
        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="Todos"
            variant={estadoSeleccionado === "TODOS" ? "filled" : "outlined"}
            color="primary"
            onClick={() => setEstadoSeleccionado("TODOS")}
          />
          <Chip
            label="En progreso"
            variant={estadoSeleccionado === "EN_PROGRESO" ? "filled" : "outlined"}
            color="info"
            onClick={() => setEstadoSeleccionado("EN_PROGRESO")}
          />
          <Chip
            label="Pendientes"
            variant={estadoSeleccionado === "PENDIENTE" ? "filled" : "outlined"}
            color="warning"
            onClick={() => setEstadoSeleccionado("PENDIENTE")}
          />
          <Chip
            label="Resueltos"
            variant={estadoSeleccionado === "RESUELTO" ? "filled" : "outlined"}
            color="secondary"
            onClick={() => setEstadoSeleccionado("RESUELTO")}
          />
          <Chip
            label="Cerrados"
            variant={estadoSeleccionado === "CERRADO" ? "filled" : "outlined"}
            color="success"
            onClick={() => setEstadoSeleccionado("CERRADO")}
          />
        </Box>

        {/* Fila 1 */}
        <Grid container spacing={2}>
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
                { name: "En progreso", value: enProgreso, color: "#3949ab" },
                { name: "Pendientes", value: pendientes, color: "#fb8c00" },
                { name: "Resueltos", value: resueltos, color: "#00acc1" },
                { name: "Cerrados", value: cerrados, color: "#43a047" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Tickets pendientes"
              value={`${pendientes} (${pctPendientes})`}
              chartData={[
                { name: "Pendientes", value: pendientes, color: "#fb8c00" },
                { name: "Otros", value: Math.max(totalTickets - pendientes, 0), color: "#e0e0e0" },
              ]}
            />
          </Grid>

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

          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Incidencias" value={incidencias} subtitle="tipoTicket = INCIDENCIA" />
          </Grid>
        </Grid>

        {/* Fila 2: tiempos de cierre */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Tiempo promedio de cierre"
              value={formatDuration(avgDur)}
              subtitle={`Basado en ${duraciones.length} tickets cerrados`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Mediana de cierre" value={formatDuration(medianDur)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Cierre más rápido" value={formatDuration(minDur)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard title="Cierre más lento" value={formatDuration(maxDur)} />
          </Grid>
        </Grid>

        {/* ✅ NUEVO: Ranking vs tiempo estimado */}
      </Grid>
      <Grid size={12} sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* ✅ Menor duración al estimado */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                ✅ Tickets más rápidos vs estimado (Top 5)
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Estimado</TableCell>
                      <TableCell align="right">Real</TableCell>
                      <TableCell align="right">Diferencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankingPorEstimado.menoresAlEstimado.map((t: any) => (
                      <TableRow key={t.idTicket} hover>
                        <TableCell>
                          {t.correlativo}-{t.titulo}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={t.estado}
                            color={getEstadoColor(t.estado) as any}
                          />
                        </TableCell>
                        <TableCell align="right">{formatDuration(t.estSeg)}</TableCell>
                        <TableCell align="right">{formatDuration(t.durRealSeg)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={`-${formatDuration(Math.abs(t.deltaSeg))}`}
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                    {rankingPorEstimado.menoresAlEstimado.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay datos para comparar.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 🚨 Mayor duración al estimado */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                🚨 Tickets más lentos vs estimado (Top 5)
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Estimado</TableCell>
                      <TableCell align="right">Real</TableCell>
                      <TableCell align="right">Exceso</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankingPorEstimado.mayoresAlEstimado.map((t: any) => (
                      <TableRow key={t.idTicket} hover>
                        <TableCell>
                          {t.correlativo}-{t.titulo}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={t.estado}
                            color={getEstadoColor(t.estado) as any}
                          />
                        </TableCell>
                        <TableCell align="right">{formatDuration(t.estSeg)}</TableCell>
                        <TableCell align="right">{formatDuration(t.durRealSeg)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={`+${formatDuration(t.deltaSeg)}`}
                            color="error"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                    {rankingPorEstimado.mayoresAlEstimado.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay datos para comparar.
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
      </Grid>

      {/* Segunda sección: responsables + cards */}
      <Grid size={12} sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={2} rowSpacing={6}>
              <Grid size={12}>
                <StatCard title="Cerrados (filtro actual)" value={`${cerrados} (${pctCerrados})`} />
              </Grid>
              <Grid size={12}>
                <StatCard
                  title="Cerrados últimos 15 días"
                  value={`${cerradosUltimos15Dias} (${pctCerradosUltimos15Dias})`}
                  subtitle="Estado = CERRADO en los últimos 15 días"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* 📊 GRÁFICO DE BARRAS POR RESPONSABLE */}
          <Grid size={{ xs: 12, md: 8 }}>
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
                        fill={["#1976d2", "#43a047", "#fb8c00", "#8e24aa"][index % 4]}
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

      {/* Fila: prioridad + validación + estado */}
      <Grid size={12} sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Tickets por prioridad
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataPrioridad} dataKey="value" nameKey="name" outerRadius={90} label>
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

          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 2.5, height: 320 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Validación de tickets cerrados
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total cerrados: {totalCerradosGlobal} | Validados: {ticketsCerradosValidados} (
                {pctValidadosCerrados}) | No validados: {ticketsCerradosNoValidados} (
                {pctNoValidadosCerrados})
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

          <Grid size={{ xs: 12, md: 6 }}>
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
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Creado por</TableCell>
                  <TableCell>Asignado a</TableCell>
                  <TableCell>Fecha creación</TableCell>
                  <TableCell>Duración</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ultimosTickets.map((ticket: any) => (
                  <TableRow key={ticket.idTicket} hover>
                    <TableCell>
                      {ticket.correlativo}-{ticket.titulo}
                    </TableCell>
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
                      {isSinAsignar(ticket) ? (
                        <Typography variant="body2" color="text.secondary">
                          Sin asignar
                        </Typography>
                      ) : (
                        ticket.asignadoA?.Name
                      )}
                    </TableCell>
                    <TableCell>{new Date(ticket.fechaCreacion).toLocaleString()}</TableCell>
                    <TableCell>{getDuracionParaMostrar(ticket)}</TableCell>
                  </TableRow>
                ))}

                {ultimosTickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
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
