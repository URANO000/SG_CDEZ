export interface ConsultasPorEspecialidad {
  especialidad: string;
  cantidad: number;
}

export interface DashboardResponse {
  adultosActivos: number;
  personalActivo: number;
  consultasActivas: number;
  consultasEsteMes: number;
  consultasPorEspecialidad: ConsultasPorEspecialidad[];
}


export interface ConsultasPorTipo {
  tipoConsulta: string;
  cantidad: number;
}

export interface ConsultaReciente {
  consultaId: string;
  adultoId: string;
  nombreAdulto: string;
  tipoConsulta: string | null;
  motivo: string | null;
  fecha: string;
}

export interface PersonalDashboardResponse {
  consultasTotales: number;
  consultasEsteMes: number;
  consultasHoy: number;
  adultosAtendidos: number;
  consultasPorTipo: ConsultasPorTipo[];
  consultasRecientes: ConsultaReciente[];
}

export interface AyudanteDashboardResponse {
  adultosActivos: number;
  adultosInactivos: number;
  adultosNuevosEsteMes: number;
  consultasTotales: number;
  consultasEsteMes: number;
  consultasHoy: number;
  consultasPorTipo: ConsultasPorTipo[];
  consultasRecientes: ConsultaReciente[];
}