import { NavLink, ScrollArea, Text } from "@mantine/core";
import { BsFillHouseDoorFill, BsClipboard2PulseFill, BsFillPeopleFill, BsPersonHeart, BsClipboardDataFill, BsMapFill } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import classes from "./Sidebar.module.css";
import { UserButton } from "../common/UserButton";
import { useAuth } from "../../services/authContext";

const links = [
  { label: "Inicio", to: "/", icon: BsFillHouseDoorFill },
  { label: "Consultas", to: "/consultas", icon: BsClipboard2PulseFill },
  { label: "Adultos Mayores", to: "/adultosMayores", icon: BsPersonHeart },
  { label: "Personal", to: "/personal", icon: BsFillPeopleFill, roles: ["ROLE_ADMIN"] },
  { label: "Auditoría", to: "/auditoria", icon: BsClipboardDataFill, roles: ["ROLE_ADMIN"] }
];

const footer = [
  { label: "Documentación", to: "/documentacion", icon: BsMapFill }
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const visibleLinks = links.filter(
    (link) => !link.roles || link.roles.includes(user.rol)
  );

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Text fw={700} size="lg" c="white">El logo va acá</Text>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.label}
              component={Link}
              to={link.to}
              label={link.label}
              leftSection={<link.icon size={18} />}
              active={location.pathname === link.to}
              classNames={{ root: classes.link }}
            />
          ))}
        </div>
      </ScrollArea>
      <div className={classes.footer}>
        {footer.map((footer) => (
          <NavLink
            key={footer.label}
            component={Link}
            to={footer.to}
            label={footer.label}
            leftSection={<footer.icon size={20} />}
            active={location.pathname === footer.to}
            classNames={{ root: classes.link }}
          />
        ))
        }
        <UserButton />
      </div>
    </nav>
  );
}