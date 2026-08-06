import { useSearchParams } from "react-router"
import classes from "./login/login.module.css"
import { ActivateAccountForm } from "../../components/ui/forms/ActivateAccountForm";

export function Activar(){
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <>
        <div className={classes.wrapper}>
                <div className={classes.card}>
                    <ActivateAccountForm token={token ?? ""} />
                </div>
            </div>
        </>
    )
}