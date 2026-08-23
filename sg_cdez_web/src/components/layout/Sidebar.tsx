import { NavLink, ScrollArea, Burger } from "@mantine/core";
import { BsFillHouseDoorFill, BsClipboard2PulseFill, BsFillPeopleFill, BsPersonHeart, BsClipboardDataFill, BsMapFill } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import classes from "./Sidebar.module.css";
import { UserButton } from "../common/UserButton";
import { useAuth } from "../../services/authContext";
import { useDisclosure } from "@mantine/hooks";

const links = [
  { label: "Inicio", to: "/", icon: BsFillHouseDoorFill },
  { label: "Consultas", to: "/consultas", icon: BsClipboard2PulseFill, roles: ["ROLE_PERSONAL"]},
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
  const [opened, { toggle, close }] = useDisclosure(false);

  if (!user) {
    return null;
  }

  const visibleLinks = links.filter(
    (link) => !link.roles || link.roles.includes(user.rol)
  );

  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        className={classes.burger}
        aria-label="Toggle navigation"
      />

      {opened && <div className={classes.overlay} onClick={close} />}

      <nav className={`${classes.navbar} ${opened ? classes.navbarOpen : ""}`}>
        <div className={classes.header}>
          <img src="/zurqui-logo.png" alt="logo" className={classes.logo} />
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
                onClick={close}
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
              onClick={close}
            />
          ))}
          <UserButton />
        </div>
      </nav>
    </>
  );
}