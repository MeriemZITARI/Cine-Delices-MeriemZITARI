export interface IMovie {
    id: string;
    title: string;
    description: string;
    director: string;
    releaseDate: Date;
    duration: number;
    genre: string[];
    imageUrl: string;
    trailerUrl?: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }
  