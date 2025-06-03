# Dictionnaire de données

## Table "user"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | CHARACTER VARYING(255) | PRIMARY KEY, NOT NULL | L'identifiant de l'utilisateur |
| last_name | TEXT | NOT NULL | Le nom de l'utilisateur |
| first_name | TEXT | NOT NULL | Le prénom de l'utilisateur |
| email | CHARACTER VARYING(255) | NOT NULL | L'adresse e-mail de l'utilisateur |
| password | CHARACTER VARYING(255) | NOT NULL | Le mot de passe de l'utilisateur |
| role | SMALLINT | NOT NULL | Le rôle de l'utilisateur |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de création de l'utilisateur |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de dernière modification de l'utilisateur |

## Table "movie"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | CHARACTER VARYING(255) | PRIMARY KEY, NOT NULL | L'identifiant du film |
| title | CHARACTER VARYING(255) | NOT NULL | Le titre du film |
| description | TEXT | NOT NULL | La description du film |
| year | CHARACTER VARYING(4) | NOT NULL | L'année de sortie du film |
| imdb_link | TEXT | NOT NULL | Le lien vers la page IMDB du film |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de création du film |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de dernière modification du film |

## Table "category"

| Champ | Type | Spécificités | Description |
| ----- | ---- | ------------ | ----------- |
| id | CHARACTER VARYING(255) | PRIMARY KEY, NOT NULL | L'identifiant de la catégorie |
| name | CHARACTER VARYING(255) | NOT NULL | Le nom de la catégorie |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de création de la catégorie |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | La date de dernière modification de la catégorie |
