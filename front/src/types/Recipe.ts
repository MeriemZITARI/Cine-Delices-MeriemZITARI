export interface IRecipe {
    id: string;
    title: string;
    description: string;
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
    imageUrl: string;
    preparationTime: number;
    difficulty: number;
    servings: number;
    anecdote?: string;
    category: {
      id: string;
      name: string;
    };
    movie?: {
      id: string;
      title: string;
      releaseDate: string;
      imageUrl?: string;
    };
    author?: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  