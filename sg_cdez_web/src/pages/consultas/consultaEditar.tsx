import { ConsultaEditarForm } from "../../components/ui/forms/ConsultaEditarForm";
import { ConsultaNutricionalEditarForm } from "../../components/ui/forms/ConsultaNutricionalEditarForm";
import { useAuth } from "../../services/authContext"

export function ConsultaEditar() {
    const { user } = useAuth();
    return (
        <>
        {
            user?.especialidad === 'Nutrición' ? (
                <ConsultaNutricionalEditarForm  />
            ) : (
                <ConsultaEditarForm />
            )
        }
        </>
    )
}