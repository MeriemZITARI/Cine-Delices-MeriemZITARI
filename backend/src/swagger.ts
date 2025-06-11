import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API de Ciné Délices',
    },
    servers: [
      {
        url: 'http://localhost:3001/api', // Remplacez par l'URL de votre API
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // Chemin vers vos fichiers de routes contenant les annotations Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger docs disponible à http://localhost:3001/api-docs');
}