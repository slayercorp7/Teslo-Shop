import { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Link,
  Chip,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";
import { countries } from "../../utils";
import Cookies from "js-cookie";

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const firstName = Cookies.get("firstName");
    if (!firstName) {
      router.push("/checkout/address");
    }
  }, []);

  const onCreateOrder = async () => {
    setIsPosting(true);

    const {hasError, message} = await createOrder(); //depende del resultado
    if(hasError){
      setIsPosting(false)
      setErrorMessage(message)
      return;
    }
    router.replace(`/orders/${message}`)
  };

  return (
    <ShopLayout title="Resumen de orden" pageDescrition="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>

      <Grid container display="flex" flexDirection="row">
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5} sx={{ paddingLeft: "30px" }}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">{`Resumen (${numberOfItems})`}</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography>{` ${shippingAddress?.firstName} ${shippingAddress?.lastName}`}</Typography>
              <Typography>
                {shippingAddress?.address}{" "}
                {shippingAddress?.address2?.length! > 0 &&
                  shippingAddress?.address2}
              </Typography>
              <Typography>{shippingAddress?.city}</Typography>
              <Typography>
                {
                  countries.find((c) => c.code === shippingAddress?.country)
                    ?.name
                }
              </Typography>
              <Typography>{shippingAddress?.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip color='error' label={errorMessage} sx={{display: errorMessage ? 'flex' : 'none', mt: 2}}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
