import { ForgotPasswordForm } from "../../components/ui/forms/ForgotPasswordForm";
import classes from "./AuthForm.module.css";

export function ForgotPassword() {
    return (
        <div className={classes.wrapper}>
            <div className={classes.card}>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}