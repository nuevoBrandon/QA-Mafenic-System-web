export interface ISignIn {
  Name: string;
  Password: string;
}


export interface IUser {
  IdUser: number;
  Name: string;
  Rol: string;
  Active?: "Y" | "N";
  CreateDate?: Date
  Password?:string
}

export interface IUserTicket {
  IdUser: number;
  Name: string;
  Rol: string;
  Active: 'Y' | 'N'; // o string si prefieres
}

export interface ITicket {
  idTicket: string;
  tipoTicket: string;       // p.ej. "INCIDENCIA"
  titulo: string;
  descripcion: string;
  estado: string;           // p.ej. "ABIERTO"
  prioridad: string;        // p.ej. "ALTA"
  tipo: string;             // p.ej. "Bug"
  creadoPorId: string;
  asignadoAId: string;
  fechaCreacion: string;  
  correlativo?:string;
  activo?:boolean;  // si lo parseas a Date, cámbialo a Date
  fechaActualizacion: string;
tiempoEstimado?: number | null;
  creadoPor: IUserTicket;
  asignadoA: IUserTicket;
}

export interface ITicketRequest {
  tipoTicket?: string;       // p.ej. "INCIDENCIA"
  titulo?: string;
  descripcion?: string;
  estado?: string;           // p.ej. "ABIERTO"
  prioridad?: string;        // p.ej. "ALTA"
  tipo?: string;
  activo?:boolean; 
  creadoPorId?: number;
  asignadoAId?: number;
  tiempoEstimado?: number | null;
}


export interface IUserRequest {
  Name: string;
  Rol: string;
  Password?: string;
  Active?: string;
}


export interface IResponse<T> {
  code: "000" | "001",
  message: string,
  data: T
}

