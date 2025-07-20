import {describe, expect, test} from "vitest";
import {RecipeService} from "@/app/service/recipe.service";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE} from "@/app/static-data.pizza";

describe('RecipeService', () => {
    test('collapseChangeLists with all adds should result in just the content of the list', () => {
        const ingredients = RecipeService.collapseChangeLists([NEAPOLITAN.ingredients]);
        expect(ingredients).toEqual(NEAPOLITAN.ingredients.items
            .map((ingredients) => ingredients.content));

        const directions = RecipeService.collapseChangeLists([NEAPOLITAN.directions]);
        expect(directions).toEqual(NEAPOLITAN.directions.items.map((directions) => directions.content))
    });

    test('collapseChangeLists inserting with adds should work as expected', () => {
        const ingredients = RecipeService.collapseChangeLists([NEAPOLITAN.ingredients, NY_STYLE.ingredients]);
        const expectedIngredients = NEAPOLITAN.ingredients.items
            .map((ingredients) => ingredients.content);
        const ingredientAddition = NY_STYLE.ingredients.items[0];
        expectedIngredients.splice(ingredientAddition.line, 0, ingredientAddition.content);
        expect(ingredients).toEqual(expectedIngredients);

        const directions = RecipeService.collapseChangeLists([NEAPOLITAN.directions, NY_STYLE.directions]);
        const expectedDirections = NEAPOLITAN.directions.items
            .map((directions) => directions.content);
        const directionInsertion = NY_STYLE.directions.items[0];
        expectedDirections.splice(directionInsertion.line, 0, directionInsertion.content);
        expect(directions).toEqual(expectedDirections);
    });

    test('collapseChangeLists inserting with replacements should work as expected', () => {
        const directions = RecipeService.collapseChangeLists([
            NEAPOLITAN.directions,
            NY_STYLE.directions,
            NEW_HAVEN_STYLE.directions,
        ]);
        const expectedDirections = RecipeService.collapseChangeLists([
            NEAPOLITAN.directions, NY_STYLE.directions
        ]);
        const directionReplacement = NEW_HAVEN_STYLE.directions.items[0];
        expectedDirections.splice(directionReplacement.line, 1, directionReplacement.content!);
        expect(directions).toEqual(expectedDirections);
    });
})