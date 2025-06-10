import React from "react";

/*interface HomePageProps {
  categories: ICategory[];
  products: IProduct[];
}*/

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur Ciné Délices</h1>
      <p className="text-lg mb-8">
        Découvrez des recettes inspirées par vos films préférés. Laissez-vous
        tenter par des plats savoureux et des desserts irrésistibles.
      </p>
      <h2 className="text-2xl font-semibold mb-4">À la une</h2>
      {/* Ajoutez ici des aperçus de recettes, des bandes-annonces de films, etc. */}
    </div>
  );
};
