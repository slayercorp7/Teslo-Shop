import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import { getSession } from "next-auth/react";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
} from "@mui/material";
import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
  LocalActivityOutlined,
} from "@mui/icons-material";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";

interface props {
  order: IOrder;
}

const checkPage: NextPage<props> = ({ order }) => {
  const {
    Subtotal,
    isPaid,
    numberOfItems,
    orderItems,
    shippingAddress,
    _id,
    total,
    tax,
  } = order;
  const { address, city, country, firstName, lastName, phone, zip, address2 } =
    shippingAddress;

  const summary = {
    numberOfItems,
    Subtotal,
    total,
    tax,
  };

  return (
    <AdminLayout
      title={'Resumen de orden'}
      subtitle={`Resumen de orden ${_id}`}
      icon={<LocalActivityOutlined/>}
    >

      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Orden por pagar"
          variant="outlined"
          color="warning"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container display="flex" flexDirection="row" sx={{ mt: 1 }}>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5} sx={{ paddingLeft: "30px" }}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems}{" "}
                {numberOfItems > 1 ? "Productos" : "Producto"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 !== "" ? address2 : ""}
              </Typography>
              <Typography>{city}</Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary order={summary} />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden Pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                      <Chip
                        sx={{ my: 2 }}
                        label="Orden por pagar"
                        variant="outlined"
                        color="warning"
                        icon={<CreditCardOffOutlined />}
                      />
                  )}
                </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });
  if (!session) {

    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {

    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};
export default checkPage;
