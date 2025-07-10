import { IMovie } from "./Movies";

export interface IRecipe {
    id: string;
    title: string;
    description: string;
    isValidated: boolean;
    ingredients: {
      ingredientId: string;
      quantity: number;
      unit: string;
      ingredient: {
        id: string;
        name: string;
      };
    }[];
    instructions: string[];
    image: string;
    duration: number;
    difficulty: number;
    servings: number;
    anecdote?: string;
    category: {
      id: string;
      name: string;
    };
    movie?: IMovie;
    author?: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  