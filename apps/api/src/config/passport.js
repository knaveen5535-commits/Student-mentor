import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env.js';

// Configure Google OAuth Strategy only if credentials are provided
if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: `${env.apiUrl}/auth/google/callback`,
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // This is called when authentication is successful
        const user = {
          id: profile.id,
          email: profile.emails[0]?.value,
          name: profile.displayName,
          picture: profile.photos[0]?.value,
          provider: profile.provider,
          providerId: profile.id
        };
        return done(null, user);
      }
    )
  );
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
