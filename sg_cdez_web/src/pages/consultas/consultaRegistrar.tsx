import { ConsultaNutricionalRegistrarForm } from "../../components/ui/forms/ConsultaNutricionalRegistrarForm";
import { ConsultaPsychRegistrarForm } from "../../components/ui/forms/ConsultaPsychRegistrarForm";
import { ConsultaRegistrarForm } from "../../components/ui/forms/ConsultaRegistrarForm";
import { useAuth } from "../../services/authContext"

export function ConsultaRegistrar() {
    const { user } = useAuth();
    const renderForm = () => {
        switch (user?.especialidad) {
            case 'Nutrición':
                return <ConsultaNutricionalRegistrarForm />;
            case 'Psicología':
                return <ConsultaPsychRegistrarForm />;
            default:
                return <ConsultaRegistrarForm />;
        }
    };
    return (
        <>
            {renderForm()}
        </>
    )
}