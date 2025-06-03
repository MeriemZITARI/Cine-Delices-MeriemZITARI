# MLD

``` mld
user (
    id
    last_name
    first_name
    email
    password
    role
)

movie (
    id
    title
    description
    year
    imdb_link
)

category (
    id
    name
)

recipe (
    id
    title
    description
    duration
    difficulty
    image
    quote
    validated
    #user_id user(id)
    #category_id category(id)
    #movie_id movie(id)
)

ingredient (
    id
    name
)

recipe_has_ingredient (
    id
    #recipe_id recipe(id)
    #ingredient_id ingredient(id)
)
```
