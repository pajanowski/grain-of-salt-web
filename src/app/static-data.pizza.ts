import {RecipeNode} from "@/app/model/recipe-node";
import {v4 as uuid} from "uuid";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";
import {ChangeList} from "@/app/model/change.list";
import {RecipeService} from "@/app/service/recipe.service";

const NEAPOLITAN_INGREDIENT_CHANGE_LIST = new ChangeList<Ingredient>()
    .add(new Ingredient('Flour', 'G', 400),0)
    .add(new Ingredient("Water", 'G', 300), 1)
    .add(new Ingredient("Salt", 'G', 12), 2)
    .add(new Ingredient("Yeast", 'G', 8), 3);
const NEAPOLITAN_DIRECTION_CHANGE_LIST = new ChangeList<Direction>()
    .add(new Direction("Bloom Yeast"), 0)
    .add(new Direction("Mix it all together"), 1)
    .add(new Direction("Proof for 24 hours"), 2)
    .add(new Direction("Bake"), 3);
export const NEAPOLITAN = new RecipeNode(
    uuid(),
    'None',
    "Neapolitan",
    NEAPOLITAN_INGREDIENT_CHANGE_LIST,
    NEAPOLITAN_DIRECTION_CHANGE_LIST
);
const NY_STYLE_ROLL_IT_OUT = new Direction("Roll it out way bigger");
export const NY_STYLE = new RecipeNode(
    uuid(),
    NEAPOLITAN.id,
    "Ny Style",
    new ChangeList<Ingredient>()
        .add(new Ingredient("Olive Oil", 'G', 20), 4),
    new ChangeList<Direction>()
        .add(NY_STYLE_ROLL_IT_OUT, 3)
);
export const NEW_HAVEN_STYLE = new RecipeNode(
    uuid(),
    NY_STYLE.id,
    "New Haven Style",
    new ChangeList<Ingredient>(),
    new ChangeList<Direction>()
        .replace(new Direction("Roll it out way bigger and thinner and cook it way hotter"), 3)
);
export const PAPA_JOHNS = new RecipeNode(
    uuid(),
    NY_STYLE.id,
    "Papa Johns Style",
    new ChangeList<Ingredient>()
        .add(new Ingredient("Sugar", 'G', 20), 4),
    new ChangeList<Direction>()
        .add(new Direction("Mix the sugar in"), 2)
);

export function getNewHavenExpectedDirections() {
    const expectedDirections = RecipeService.collapseChangeLists([
        NEAPOLITAN.directions, NY_STYLE.directions
    ]);
    const directionReplacement = NEW_HAVEN_STYLE.directions.items[0];
    expectedDirections.splice(directionReplacement.line, 1, directionReplacement.content!);
    return expectedDirections;
}


export function getNyStyleDirections() {
    const expectedDirections = NEAPOLITAN.directions.items
        .map((directions) => directions.content);
    const directionInsertion = NY_STYLE.directions.items[0];
    expectedDirections.splice(directionInsertion.line, 0, directionInsertion.content);
    return expectedDirections;
}

export function getNyStyleIngredients() {
    const expectedIngredients = NEAPOLITAN.ingredients.items
        .map((ingredients) => ingredients.content);
    const ingredientAddition = NY_STYLE.ingredients.items[0];
    expectedIngredients.splice(ingredientAddition.line, 0, ingredientAddition.content);
    return expectedIngredients;
}