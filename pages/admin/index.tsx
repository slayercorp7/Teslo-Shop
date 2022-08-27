import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { AdminLayout } from "../../components/layouts";
import { SummaryTitle } from "../../components/admin/SummaryTitle";
import { DashboardSummaryResponse } from "../../interfaces";

const DashbordPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000, //30sec
    }
  );

  const [refreshIn, setRefreshIn] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn -1 : 60)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!data && !error) {
    return <></>;
  }
  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;


  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Estadisticas Generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
          title={numberOfOrders}
          subtitle="Ordenes Totales"
        />
        <SummaryTitle
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 30 }} />}
          title={paidOrders}
          subtitle="Ordenes Pagadas"
        />
        <SummaryTitle
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 30 }} />}
          title={notPaidOrders}
          subtitle="Ordenes Pendientes"
        />
        <SummaryTitle
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfClients}
          subtitle="Clientes"
        />
        <SummaryTitle
          icon={<CategoryOutlined color="success" sx={{ fontSize: 40 }} />}
          title={numberOfProducts}
          subtitle="Productos"
        />
        <SummaryTitle
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          title={productsWithNoInventory}
          subtitle="Sin Existencias"
        />
        <SummaryTitle
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          title={lowInventory}
          subtitle="Bajo Inventario"
        />
        <SummaryTitle
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={refreshIn}
          subtitle="Actualizacion en..."
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashbordPage;
