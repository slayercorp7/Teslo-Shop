import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React from "react";
import useSWR from "swr";
import { AdminLayout } from "../../components/layouts";
import { IOrder, IUser } from "../../interfaces";

const column: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 200 },
  { field: "email", headerName: "Correo", width: 180 },
  { field: "name", headerName: "Nombre Completo", width: 140 },
  { field: "total", headerName: "Monto Total", width: 120 },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" color="success" icon={<CreditScoreOutlined/>}/>
      ) : (
        <Chip variant="outlined" icon={<CreditCardOffOutlined/>} color="error" />
      );
    },
    width: 80
  },
  { field: "n_products", headerName: "N° Productos", align: "center", width:120},
  {
    field: "check",
    headerName: "Ver Orden",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Creada en:" , width: 120 },

];

const OrdersPage = () => {

    const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

    if(!data && !error){
        return <></>
    }

    const rows = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        n_products: order.numberOfItems,
        createdAt: order.createdAt,
    }))

  return (
    <AdminLayout
      title={"Ordenes"}
      subtitle={"Mantenimiento de Ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={column}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
