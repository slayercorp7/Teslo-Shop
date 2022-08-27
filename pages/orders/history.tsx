import { GetServerSideProps, NextPage } from 'next';
import NextLink from "next/link";
import { getSession } from 'next-auth/react';

import { Chip, Grid, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const column: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullName", headerName: "Nombre Completo", width: 300 },

  {
    field: "paid",
    headerName: "Estado actual",
    description: "Muestra información del estado de la orden",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="Por Pagar" variant="outlined" />
      );
    },
  },
  {
    field: "check",
    headerName: "Ver orden",
    description: "Redirecciona a la pagina para el pago",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link variant="button" underline="always">
            <Chip color="success" label="Verificar" variant="outlined" />
          </Link>
        </NextLink>
      );
    },
    sortable: false
  },
];

interface props {
  orders: IOrder[]
}
const HistoryPage: NextPage<props> = ({orders}) => {
  const rows = orders.map(({_id, isPaid, shippingAddress}, idx) => {
    return {
      id: idx + 1,
      paid: isPaid,
      fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      orderId: _id
    }
  })

  return (
    <ShopLayout
      title={"Historial de Ordenes"}
      pageDescrition={"Historial de ordenes del cliente"}
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={column}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session:any = await getSession({req});

  if(!session){
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      }
    }
  }

  const id = session.user._id;

  const orders = await dbOrders.getOrdersByUser(id);


  return {
    props: {
      orders
    }
  }
}
export default HistoryPage;
