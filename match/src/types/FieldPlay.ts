export interface FieldPlay {
    id: number;
    name: string;
    direction: string;
    price: number;
    percentage: number;
    bestSchedules: string[];
    summary: Summary;
}

export interface Summary {
    Ingresos: number;
    IngresosPorcentaje: number;
    Ocupacion: number;
    OcupacionPorcentaje: number;
    Reservas: number;
    ReservasPorcentaje: number;
    IngresosTotales: number;
    HorasTotales: number;
}
