import {Container, Title, Text, Group, Button} from "@mantine/core";
import classes from "./500.module.css";

export function ServerError(){
    return (
         <div className={classes.root}>
            <Container>
                <div className={classes.label}>500</div>
                <Title className={classes.title}>Error Del Servidor...</Title>
                <Text size="lg" ta="center" className={classes.description}>
                    Lo sentimos, algo salió mal. Por favor, inténtalo de nuevo más tarde.
                </Text>
                <Group justify="center">
                    <Button size="md" onClick={() => window.location.reload()}>
                        Refrescar Página
                    </Button>
                </Group>
            </Container>
         </div>
    )
}