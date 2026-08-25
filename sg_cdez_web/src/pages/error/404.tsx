import { Container, Title, Text, Group, Button} from "@mantine/core";
import classes from "./404.module.css";
import { NotFoundIllustration } from "../../components/ui/imgs/404Illustration";
import { Link} from "react-router";


export function NotFound(){
    return (
        <Container className={classes.root}>
            <div className={classes.inner}>
                <NotFoundIllustration className={classes.image} />
                <div className={classes.content}>
                    <Title className={classes.title}>Página No Encontrada</Title>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        La página que intentas abrir no existe.
                        Es posible que hayas escrito mal la dirección o que la página se haya movido a otra URL.
                    </Text>
                    <Group justify="center">
                        <Link to="/">
                        <Button size="md">Ir a página de inicio.</Button>
                        </Link>
                    </Group>
                </div>
            </div>
        </Container>
    );
}