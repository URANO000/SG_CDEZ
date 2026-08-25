import { AdminDashboard } from "../../components/common/AdminDashboard";
import { AyudanteDashboard } from "../../components/common/AyudanteDashboard";
import { PersonalDashboard } from "../../components/common/PersonalDashboard";
import { useAuth } from "../../services/authContext"

export function Home() {
    const { user } = useAuth();

    return (
        <>
            {
                user?.rol === "ROLE_ADMIN" && (
                    <AdminDashboard />
                )
            }
            {
                user?.rol === "ROLE_PERSONAL" && (
                    <PersonalDashboard />
                )
            }
            {
                user?.rol == "ROLE_AYUDANTE" && (
                    <AyudanteDashboard />
                )
            }
        </>
    )
}