

export function mostrarFecha(fecha: string | null): string {
    if (!fecha) {
        return "N/A";
    }

    const utcDate = fecha.endsWith('Z') || fecha.includes('+') || fecha.includes('-')
        ? new Date(fecha)
        : new Date(fecha + 'Z');

    return new Intl.DateTimeFormat("es-CR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(utcDate);
}