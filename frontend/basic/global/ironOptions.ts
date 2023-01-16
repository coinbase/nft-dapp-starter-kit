export const ironOptions = {
  cookieName: 'myCommunity',
  password: 'myLongAnd32CharacterComplexPassword!',
  cookieOptions: {
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    secure: process.env.NODE_ENV === 'production',
  },
};
