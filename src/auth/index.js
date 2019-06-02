import basicAuth from 'express-basic-auth';

const authOptions = {
  challenge: true,
  realm: 'literate-shrimp'
};

const terminalOnly = basicAuth({
  users: { terminal: '123456' },
  ...authOptions
});

const portalOnly = basicAuth({
  users: { portal: '123456' },
  ...authOptions
});

export default {
  terminalOnly,
  portalOnly
};
