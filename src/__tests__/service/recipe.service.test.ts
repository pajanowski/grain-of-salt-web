import {describe, expect, test} from "vitest";
import {RecipeService} from "@/app/service/recipe.service";
import {
    getNewHavenExpectedDirections, getNyStyleDirections,
    getNyStyleIngredients,
    NEAPOLITAN,
    NEW_HAVEN_STYLE,
    NY_STYLE
} from "@/app/static-data.pizza";
import {branchingPizzaSetup} from "@/__tests__/misc";


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
        const expectedIngredients = getNyStyleIngredients();
        expect(ingredients).toEqual(expectedIngredients);

        const directions = RecipeService.collapseChangeLists([NEAPOLITAN.directions, NY_STYLE.directions]);
        const expectedDirections = getNyStyleDirections();
        expect(directions).toEqual(expectedDirections);
    });

    test('collapseChangeLists inserting with replacements should work as expected', () => {
        const directions = RecipeService.collapseChangeLists([
            NEAPOLITAN.directions,
            NY_STYLE.directions,
            NEW_HAVEN_STYLE.directions,
        ]);
        const expectedDirections = getNewHavenExpectedDirections();
        expect(directions).toEqual(expectedDirections);
    });

    test('getRecipeFromNodeId', async () => {
        branchingPizzaSetup();
        const recipeFromNodeId = await RecipeService.getRecipeFromNodeId(NEW_HAVEN_STYLE.id);
        expect(recipeFromNodeId.directions).toEqual(getNewHavenExpectedDirections())
        expect(recipeFromNodeId.ingredients).toEqual(getNyStyleIngredients()); // there was no ingredient change
    })
})