export interface LegalSectionContent {
  title: string;
  paragraphs: string[];
}

export const LEGAL_DOCUMENT_VERSION = "2026-08";

export const termsSections: LegalSectionContent[] = [
  {
    title: "Uso de Match",
    paragraphs: [
      "Match conecta jugadores, organizadores y espacios deportivos. Debes usar la plataforma de forma lícita, respetuosa y conforme a las reglas de cada establecimiento.",
      "Debes tener capacidad legal para contratar. Si eres menor de edad, necesitas la autorización de tu representante legal.",
    ],
  },
  {
    title: "Cuenta y seguridad",
    paragraphs: [
      "Eres responsable de mantener seguro el acceso a tu correo y dispositivo. Informa cualquier acceso no reconocido y mantén actualizados tus datos.",
      "Podemos limitar o suspender cuentas ante fraude, abuso, suplantación o incumplimiento de estas condiciones.",
    ],
  },
  {
    title: "Reservas y cancelaciones",
    paragraphs: [
      "La disponibilidad, precio, reglas de acceso y política de cancelación se muestran antes de confirmar cada reserva. Las condiciones particulares del establecimiento también forman parte de la operación.",
      "Reembolsos, cambios y ausencias se procesan según la política informada durante la compra y la legislación aplicable.",
    ],
  },
  {
    title: "Pagos y planes",
    paragraphs: [
      "Los pagos pueden ser procesados por proveedores autorizados. Match no almacena los datos completos de tu tarjeta cuando el proveedor utiliza tokenización.",
      "Los planes de pago muestran precio, periodo, renovación y forma de cancelación antes de contratarse. No realizaremos cargos sin una confirmación válida.",
    ],
  },
  {
    title: "Conducta y responsabilidad",
    paragraphs: [
      "No está permitido acosar, discriminar, manipular reservas, cometer fraude ni afectar la seguridad de otras personas o de la plataforma.",
      "Match facilita la experiencia digital. Cada establecimiento conserva la responsabilidad sobre sus instalaciones y cada usuario sobre su conducta y condición para practicar deporte.",
    ],
  },
  {
    title: "Cambios y finalización",
    paragraphs: [
      "Puedes dejar de usar Match y solicitar el cierre de tu cuenta. Podemos actualizar estas condiciones y comunicaremos los cambios relevantes antes de que entren en vigor.",
    ],
  },
];

export const privacySections: LegalSectionContent[] = [
  {
    title: "Datos que tratamos",
    paragraphs: [
      "Tratamos datos de cuenta, contacto, reservas, pagos tokenizados, soporte, dispositivo, seguridad y uso de la aplicación. Solo solicitamos ubicación cuando una función la necesita y con tu permiso.",
    ],
  },
  {
    title: "Para qué los usamos",
    paragraphs: [
      "Usamos tus datos para crear y proteger tu cuenta, gestionar reservas y pagos, ofrecer soporte, prevenir fraude, mejorar Match y cumplir obligaciones legales.",
      "Las comunicaciones promocionales requieren la base legal o consentimiento correspondiente y podrás desactivarlas.",
    ],
  },
  {
    title: "Con quién se comparten",
    paragraphs: [
      "Compartimos la información necesaria con establecimientos, procesadores de pago, servicios de infraestructura, analítica y soporte bajo obligaciones de seguridad y confidencialidad.",
      "No vendemos tus datos personales. Podemos comunicarlos cuando una autoridad competente lo exija o para proteger derechos y seguridad.",
    ],
  },
  {
    title: "Conservación y seguridad",
    paragraphs: [
      "Conservamos los datos durante el tiempo necesario para prestar el servicio, resolver disputas y cumplir obligaciones. Aplicamos controles técnicos y organizativos, aunque ningún sistema elimina por completo el riesgo.",
    ],
  },
  {
    title: "Tus decisiones y derechos",
    paragraphs: [
      "Puedes solicitar acceso, corrección, eliminación, oposición, limitación o portabilidad cuando corresponda. También puedes retirar permisos del dispositivo y cerrar tu cuenta.",
      "Las solicitudes se atenderán desde el canal de privacidad y soporte disponible en Match, verificando previamente tu identidad.",
    ],
  },
  {
    title: "Actualizaciones",
    paragraphs: [
      "Informaremos los cambios relevantes de esta política. La versión aplicable y su fecha estarán disponibles en esta pantalla.",
    ],
  },
];
