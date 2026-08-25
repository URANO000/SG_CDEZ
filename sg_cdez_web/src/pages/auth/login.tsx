import { LoginForm} from "../../components/ui/forms/LoginForm";
import classes from "../../components/ui/styleModules/AuthForm.module.css";


export function Login() {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.card}>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}