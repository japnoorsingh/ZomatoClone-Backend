import JwtPassport from "passport-jwt";

// Database Model
import { UserModel } from "../database/allModels";

const JWTStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract JWT from request | Basically, removes 'Bearer ' from the authorization in the header
  secretOrKey: "ZomatoAPP",  // For encoding and decoding the token
};

export default (passport) => {
  passport.use(
    new JWTStrategy(options, async (jwt__payload, done) => {  // jwt__payload => Data obtained from decoding the token which consists of user id
      try {
        const doesUserExist = await UserModel.findById(jwt__payload.user);  
        if (!doesUserExist) return done(null, false);
        return done(null, doesUserExist);  // null => no error found
      } catch (error) {
        throw new Error(error);
      }
    })
  );
};

// Explanation
// const req = {
//     headers: {
//         Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjE5NTIxODRkOWIwZjQ2ZTI0MDFhNTdiIiwiaWF0IjoxNjM3NzY3MTEyfQ.8BHsAcNZe_zuT-4pcqaZE63YmH3F_MfMobdGblzyTxQ"
//     }
// }
// will be converted to
// const req = {
//     headers: {
//         Authorization: "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjE5NTIxODRkOWIwZjQ2ZTI0MDFhNTdiIiwiaWF0IjoxNjM3NzY3MTEyfQ.8BHsAcNZe_zuT-4pcqaZE63YmH3F_MfMobdGblzyTxQ"
//     }
// }
// const jwt__payload = {
//     user: sfasf3423szdfa34324
// }