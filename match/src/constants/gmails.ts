import { User } from "../types/auth"
import { ClienteReservation } from "../types/ClientReservation"
import { FieldPlay } from "../types/FieldPlay"

export const gmails: User[] = [
    {
        id: 1,
        username: "Frank",
        email: "frankah@gmail.com",
        role: "admin"
    },
    {
        id: 2,
        username: "Frank Administrator",
        email: "administrador@gmail.com",
        role: "player"
    },
    {
        id: 0,
        username: "Administrator",
        email: "",
        role: "admin"
    }
]

export const gmailsCode = [
    {
        email: "frankah@gmail.com",
        codigo: "123456"
    },
    {
        email: "administrador@gmail.com",
        codigo: "987654"
    },
    {
        email: "",
        codigo: "987654"
    }
]


export const fieldsPlay: FieldPlay[] = [
    {
        id: 1,
        name: "cancha 1",
        direction: "AV. Ejercito",
        price: 50,
        percentage: 90,
        bestSchedules: [
            "7 - 8 pm|98",
            "8 - 9 pm|95",
            "4 - 6 pm|91"
        ],
        summary: {
            Ingresos: 1500,
            IngresosPorcentaje: 90,
            Ocupacion: 50,
            OcupacionPorcentaje: 85,
            Reservas: 15,
            ReservasPorcentaje: 60,
            IngresosTotales: 3500,
            HorasTotales: 600
        }
    },
    {
        id: 2,
        name: "cancha 2",
        direction: "AV. La cultura",
        price: 60,
        percentage: 50,
        bestSchedules: [
            "7 - 8 pm|98",
            "8 - 9 pm|95",
            "4 - 6 pm|93"
        ],
        summary: {
            Ingresos: 1600,
            IngresosPorcentaje: 80,
            Ocupacion: 12,
            OcupacionPorcentaje: 75,
            Reservas: 10,
            ReservasPorcentaje: 85,
            IngresosTotales: 2600,
            HorasTotales: 450
        }
    }
]


export const clientReservations: ClienteReservation[] = [
    {
        id: 3,
        customer: 'frank',
        schudele: '7 - 8 pm',
        fieldId: 1,
        fieldName: 'cancha 1',
        cost: 40,
    },
    {
        id: 4,
        customer: 'luis',
        schudele: '4 - 6 pm',
        fieldId: 2,
        fieldName: 'cancha 2',
        cost: 60
    }
]