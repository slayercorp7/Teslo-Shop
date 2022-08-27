import { useEffect, useState } from "react";
import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { tesloAPI } from "../../api";
import { AdminLayout } from "../../components/layouts";
import { IUser } from "../../interfaces";

const selectValues = ["admin", "client", "super-user", "SEO"];
const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if(data){
        setUsers(data)
    }
  }, [data])

  if (!data && !error) {
    return <></>;
  }

  const onRoleUpdated = async (userId: string, newRole: string) => {

    const previousUsers = users.map(user => ({...user}))
    const updatedUsers = users.map((user) => ({
        ...user,
        role: userId === user._id ? newRole : user.role
    }))

    setUsers(updatedUsers);
    try {
      await tesloAPI.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      console.log(error);
      setUsers(previousUsers)
      alert("no se pudo actualizar el usuario");
    }
  };
  const column: GridColDef[] = [
    { field: "Email", headerName: "Correo", width: 250 },
    { field: "Name", headerName: "Nombre", width: 300 },
    {
      field: "Role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.Role}
            label="Rol"
            sx={{ width: "300px" }}
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
          >
            {selectValues.map((item) => (
              <MenuItem value={item} key={item}>{item}</MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    Email: user.email,
    Name: user.name,
    Role: user.role,
  }));

  return (
    <AdminLayout
      title={"Usuarios"}
      subtitle={"Mantenimiento de Usuarios"}
      icon={<PeopleOutline />}
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

export default UsersPage;
