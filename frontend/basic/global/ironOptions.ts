export const ironOptions = {
  cookieName: 'myCommunity',
  password: 'myLongAnd32CharacterComplexPassword!',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
