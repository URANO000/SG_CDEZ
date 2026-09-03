import { ConsultaEditarForm } from "../../components/ui/forms/ConsultaEditarForm";
import { ConsultaNutricionalEditarForm } from "../../components/ui/forms/ConsultaNutricionalEditarForm";
import { ConsultaPsychEditarForm } from "../../components/ui/forms/ConsultaPsychEditarForm";
import { useAuth } from "../../services/authContext"

export function ConsultaEditar() {
    const { user } = useAuth();
        const renderForm = () => {
            switch (user?.especialidad) {
                case 'Nutrición':
                    return <ConsultaNutricionalEditarForm />;
                case 'Psicología':
                    return <ConsultaPsychEditarForm />;
                default:
                    return <ConsultaEditarForm />;
            }
        };
        return (
            <>
                {renderForm()}
            </>
        )
  
}