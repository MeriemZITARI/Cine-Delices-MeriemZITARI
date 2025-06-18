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
    duration: number;
    difficulty: number;
    servings: number;
    quote?: string;
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
  