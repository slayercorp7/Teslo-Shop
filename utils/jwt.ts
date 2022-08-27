import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("no hay secret key de JWT-revisar variables de entorno");
  }

  return jwt.sign(
    //payload
    { _id, email },
    //seed
    process.env.JWT_SECRET_KEY,
    //opciones
    { expiresIn: "2d" }
  );
};

export const isValidToken = (token: string): Promise<string> => {

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("no hay secret key de JWT-revisar variables de entorno");
  }
  if(token.length < 10 ){
    return Promise.reject('jwt no valido')
  }

  return new Promise((res, rej) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY || "", (err, payload) => {
        if (err) return rej("JWT no valido");

        const { _id } = payload as { _id: string };
        res(_id);
      });
    } catch (error) {
      rej("JWT no valido");
    }
  });
};
