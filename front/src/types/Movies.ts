
import { IRecipe } from "./Recipe";



export interface IMovie {
  id: string;
  title: string;
  description: string;
  imdbLink: string;
  moviedbId?: string;
  releaseDate: string;
  createdAt?: string;
  updatedAt?: string;
  recipes?: IRecipe[];
}
