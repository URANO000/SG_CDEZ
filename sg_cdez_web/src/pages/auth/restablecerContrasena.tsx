import { ResetPasswordForm } from "../../components/ui/forms/ResetPasswordForm";
import { useSearchParams } from "react-router"
import classes from "../../components/ui/styleModules/AuthForm.module.css";

export function RestablecerContrasena() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <ResetPasswordForm token={token ? token : ""} />
            </div>
        </div>
    )
}