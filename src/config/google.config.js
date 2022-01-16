import googleOAuth from "passport-google-oauth20";  // Passport -> Provides ability to signin  |  googleOAuth -> Signin with google
import { UserModel } from "../database/allModels";

const GoogleStrategy = googleOAuth.Strategy; // Setting of google authentication

export default (passport) => {

    passport.use(
    new GoogleStrategy(
      // Parameter 1: Configuration
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      // Parameter 2: Callback function -> Receives all the info from param 1
      async (accessToken, refreshToken, profile, done) => {   // Receive these 3 params | done -> means function is dne | Profle -> cntains everything on user
        // create a new user object
        const newUser = {
          fullName: profile.displayName,
          email: profile.emails[0].value,  // There can \be multiple emails
          profilePic: profile.photos[0].value,
        };

        try { // No error :)
          // check if the user exist
          const user = await UserModel.findOne({ email: newUser.email });  // If he already has account

          if (user) {  // I user already exist and google authenticates after SIGNIN, create a token
            // generate token
            const token = user.generateJwtToken();

            // return user
            done(null, { user, token });  // Param 1 = error = null

          } else {  // Account does not exist - Signup
            // create new user
            const user = await UserModel.create(newUser);

            // generate token
            const token = user.generateJwtToken();

            // return user
            done(null, { user, token });
          }

        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Used to prevent passport from crashing while using google oauth (It can sometimes crash)
  passport.serializeUser((userData, done) => done(null, { ...userData })); 
  passport.deserializeUser((id, done) => done(null, id));
};

