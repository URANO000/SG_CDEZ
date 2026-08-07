import { ResendVerificationForm } from "../../components/ui/forms/ResendVerificationForm";
import classes from "./AuthForm.module.css";

export function ResendVerification() {
    return (
        <div className={classes.wrapper}>
             <div className={classes.card}>
                <ResendVerificationForm />
             </div>
        </div>
    )
}