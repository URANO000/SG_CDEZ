import { ConsultaNutricionalRegistrarForm } from "../../components/ui/forms/ConsultaNutricionalRegistrarForm";
import { ConsultaRegistrarForm } from "../../components/ui/forms/ConsultaRegistrarForm";
import { useAuth } from "../../services/authContext"

export function ConsultaRegistrar() {
    const { user } = useAuth();
    return (
        <>
        {
            user?.especialidad === 'Nutrición' ? (
                <ConsultaNutricionalRegistrarForm />
            ) : (
                <ConsultaRegistrarForm />
            )
        }
        </>
    )
}