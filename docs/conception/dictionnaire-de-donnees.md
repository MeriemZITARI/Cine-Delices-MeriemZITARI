# Dictionnaire de données

## Table "user"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant de l'utilisateur |
| last_name | VARCHAR(255) | NOT NULL | Le nom de l'utilisateur |
| first_name | VARCHAR(255) | NOT NULL | Le prénom de l'utilisateur |
| email | VARCHAR(255) | UNIQUE, NOT NULL | L'adresse e-mail de l'utilisateur |
| password | VARCHAR(255) | NOT NULL | Le mot de passe hashé de l'utilisateur |
| is_admin | BOOLEAN | NOT NULL | L'utilisateur est un admin |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création de l'utilisateur |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification de l'utilisateur |

## Table "movie"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant du film |
| title | VARCHAR(255) | NOT NULL | Le titre du film |
| description | TEXT | NOT NULL | La description du film |
| imdb_link | TEXT | NOT NULL | Le lien vers la page IMDB du film |
| release_date | TIMESTAMPTZ | NOT NULL | La date de sortie du film |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création du film |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification du film |

## Table "category"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant de la catégorie |
| name | VARCHAR(255) | NOT NULL | Le nom de la catégorie |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création de la catégorie |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification de la catégorie |

## Table "recipe"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant de la recette |
| title | VARCHAR(255) | NOT NULL | Le titre de la recette |
| description | TEXT | NOT NULL | La discription de la recette |
| duration | SMALLINT | NOT NULL | La durée de la recette |
| difficulty | SMALLINT | NOT NULL | La difficulté de la recette évaluée sur 5 |
| image | VARCHAR(255) | NOT NULL | L'illustration de la recette |
| quote | VARCHAR(255) | NOT NULL | La citation correspondant à la recette |
| is_validated | BOOLEAN | NOT NULL, DEFAULT FALSE | La recette a passé l'étape de validation |
| user_id | VARCHAR(255) | FOREIGN KEY, REFERENCES user(id), NOT NULL | L'identifiant de l'utilisateur ayant créé la recette |
| category_id | VARCHAR(255) | FOREIGN KEY, REFERENCES category(id), NOT NULL | L'identifiant de la catégorie correspondant à la recette |
| movie_id | VARCHAR(255) | FOREIGN KEY, REFERENCES movie(id) | L'identifiant de la catégorie correspondant à la recette |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création de la recette |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification de la recette |

## Table "ingredient"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant de l'ingrédient |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Le titre de l'ingrédient |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création de l'ingrédient |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification de l'ingrédient |

## Table "recipe_has_ingredient"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | VARCHAR(255) | PRIMARY KEY, NOT NULL | L'identifiant de l'association recette-ingrédient |
| unit | VARCHAR(255) | NOT NULL | L'unité de mesure de l'ingrédient utilisé dans la recette |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | La quantité de l'ingrédient utilisé dans la recette |
| recipe_id | VARCHAR(255) | FOREIGN KEY, REFERENCES recipe(id), NOT NULL | L'identifiant de la recette correspondant à l'association |
| ingredient_id | VARCHAR(255) | FOREIGN KEY, REFERENCES ingredient(id), NOT NULL | L'identifiant de l'ingrédient correspondant à l'association |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de création de l'association |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | La date de dernière modification de l'association |
