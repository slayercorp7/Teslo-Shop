import NextLink from "next/link";
import { Box, IconButton, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";

const EmptyPage = () => {
  return (
    <ShopLayout
      title="Carrito vacio"
      pageDescrition="No hay articulos agregados al carrito"
    >
      <Box
        display={{ xs: "grid", md: "flex" }}
        justifyContent="center"
        alignItems={"center"}
        height="calc(100vh - 200px)"
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h1"
            component={"h1"}
            fontSize={80}
            fontWeight={200}
          >
            carrito vacio
          </Typography>
          <IconButton
            size="large"
            color="error"
            sx={{ width: "100px", height: "100px" }}
          >
            <RemoveShoppingCartOutlined sx={{ fontSize: 60 }} />
          </IconButton>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
