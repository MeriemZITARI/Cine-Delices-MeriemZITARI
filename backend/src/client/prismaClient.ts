// src/prismaClient.ts
/**
 * @fileoverview Ce module initialise et exporte une instance de PrismaClient,
 * qui est utilisée pour interagir avec la base de données dans l'application.
    * Il est important de noter que cette instance doit être partagée dans toute l'application
// @see {@link https://www.prisma.io/docs/getting-started Prisma Getting Started Guide}

* @module prismaClient
    */
import { PrismaClient } from '../generated/prisma';


export const prisma = new PrismaClient();