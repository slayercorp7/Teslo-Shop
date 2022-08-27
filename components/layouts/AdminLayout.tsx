import { Box, Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { AdminNavBar } from "../admin";
import { SideMenu } from "../ui";

interface props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<PropsWithChildren<props>> = ({
  children,
  title,
  subtitle,
  icon,
}) => {
  return (
    <>
      <nav>
        <AdminNavBar />
      </nav>
      <SideMenu />

      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2">{subtitle}</Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
      {/* footer */}
    </>
  );
};
