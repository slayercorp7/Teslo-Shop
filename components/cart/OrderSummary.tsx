import { LocalTaxiSharp } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { useContext } from "react";
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface props {
  order?: {
    numberOfItems: number;
    Subtotal: number;
    total: number;
    tax: number;
  };
}

export const OrderSummary: NextPage<props> = ({ order }) => {
  const cart = useContext(CartContext);
  const data = order ? order : cart;

  const { Subtotal, numberOfItems, tax, total } = data;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>N° de Productos </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? "items" : "item"}{" "}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(Subtotal)} </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{`Impuestos ${
          Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100
        } %`}</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(tax)} </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{currency.format(total)} </Typography>
      </Grid>
    </Grid>
  );
};
