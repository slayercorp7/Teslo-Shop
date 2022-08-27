import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import { ErrorOutlineOutlined } from "@mui/icons-material";

type FormData = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);
  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    // const isValidLogin = await loginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // //navegar a pantalla de usuario
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              <Chip
                label="No reconocemos ese usuario - contraseña"
                color="error"
                icon={<ErrorOutlineOutlined />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "campo requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "campo requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>
            <Grid
              container
              item
              xs={12}
              display="flex"
              justifyContent="start"
              flexDirection="column"
            >
              <Grid item>
                <Typography>¿No tienes Cuenta?</Typography>
              </Grid>
              <Grid item sx={{ mt: "10px" }}>
                <NextLink
                  href={
                    router.query.p
                      ? `/auth/register?p=${router.query.p}`
                      : "/auth/register"
                  }
                  passHref
                >
                  <Link>
                    <Button color="secondary" fullWidth>
                      {" "}
                      Registrarse{" "}
                    </Button>
                  </Link>
                </NextLink>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} flexDirection="column">
            <Divider sx={{ width: "100%", mb: 2, mt: 2, mr: 2 }} />
            {Object.values(providers).map((provider: any) => {
              if (provider.id === "credentials") {
                return <div key="credentials"></div>;
              }
              return (
                <Button
                  color="secondary"
                  fullWidth
                  key={provider.id}
                  sx={{ mb: 1 }}
                  onClick={() => signIn(provider.id)}
                >
                  {provider.name}
                </Button>
              );
            })}
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default LoginPage;
