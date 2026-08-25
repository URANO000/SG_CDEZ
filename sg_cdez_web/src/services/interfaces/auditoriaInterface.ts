export interface AuditoriaCambio {
  anterior: unknown;
  nuevo: unknown;
}

export interface AuditoriaResponse {
  auditoriaId: string;

  usuarioId: string;
  usuario: string;
  nombreUsuario: string;

  accion: string;
  modulo: string;

  entidadAfectada: string;
  registroAfectadoId: string;

  descripcion: string;

  cambios: Record<string, AuditoriaCambio> | null;

  createdAt: string;
}

export interface AuditoriaFiltros {
  usuarioId?: string;
  usuario?: string;
  accion?: string;
  modulo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface AuditoriaPageResponse {
  content: AuditoriaResponse[];

  empty: boolean;
  first: boolean;
  last: boolean;

  number: number;
  numberOfElements: number;

  size: number;

  totalElements: number;
  totalPages: number;
}
