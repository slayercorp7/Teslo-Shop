import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { getSession } from "next-auth/react";
import { PayPalButtons } from "@paypal/react-paypal-js";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { tesloAPI } from "../../api";

interface props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status:
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

const OrderPage: NextPage<props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
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

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en paypal");
    }
    setIsPaying(true);
    try {
      const { data } = await tesloAPI.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: _id,
      });
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert(error);
    }
  };
  return (
    <ShopLayout
      title={`Resumen de orden ${_id}`}
      pageDescrition="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: {_id}
      </Typography>

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
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                  flexDirection="column"
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
                    <>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: total.toString(),
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then((details) => {
                            onOrderCompleted(details);
                          });
                        }}
                      />
                      <Chip
                        sx={{ my: 2 }}
                        label="Orden por pagar"
                        variant="outlined"
                        color="warning"
                        icon={<CreditCardOffOutlined />}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
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
  if (order.user !== session.user._id) {
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
export default OrderPage;
