import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
    title: 'API Demo para Recebimento de Pagamentos',
    version: '1.0.0',
    description:
      'API de demonstração para um hipotético sistema de recebimento de pagamentos em cartão.'
  },
  basePath: '/'
};

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./src/routes/*.js']
};

export default swaggerJSDoc(swaggerOptions);
