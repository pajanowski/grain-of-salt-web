import {describe, expect, test, beforeEach} from 'vitest'
import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";
import "fake-indexeddb/auto";
import {RecipeNode} from "@/app/model/recipe-node";
import {branchingPizzaSetup, nonBranchingPizzaSetup} from '../misc';
import {ChangeList} from "@/app/model/change.list";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";

describe("RecipeNodeStore", () => {
    beforeEach(async () => {
        await RecipeNodeStore.truncateTable();
    });

    test('RecipeNodeStore should return an empty recipe node', async () => {
      const actual = await RecipeNodeStore.getRootRecipes();
      expect(actual).toStrictEqual([])
    })

    test('RecipeNodeStore should return recipe nodes after they are put in there', async () => {
      nonBranchingPizzaSetup();

      const rootRecipes: RecipeNode[] = await RecipeNodeStore.getRootRecipes();
      expect(rootRecipes.length).to.eq(1);
      expect(rootRecipes[0]).toEqual(NEAPOLITAN);
    });

    test('RecipeNodeStore should return only recipe nodes asked for', async () => {
      nonBranchingPizzaSetup();

      expect(await RecipeNodeStore.getRecipeNodeById("asdf")).to.equal(undefined);
      expect(await RecipeNodeStore.getRecipeNodeById(NEAPOLITAN.id)).toEqual(NEAPOLITAN);
      expect(await RecipeNodeStore.getRecipeNodeById(NY_STYLE.id)).toEqual(NY_STYLE);
      expect(await RecipeNodeStore.getRecipeNodeById(PAPA_JOHNS.id)).toEqual(PAPA_JOHNS);
    });

    test('RecipeNodeStore should only return the ancestors of nodes when asked for', async () => {
      nonBranchingPizzaSetup();

      expect(await RecipeNodeStore.getRecipeAncestors("asdf")).toEqual([]);
      expect(await RecipeNodeStore.getRecipeAncestors(NEAPOLITAN.id)).toEqual([NEAPOLITAN]);
      expect(await RecipeNodeStore.getRecipeAncestors(NY_STYLE.id)).toEqual([NY_STYLE, NEAPOLITAN]);
      expect(await RecipeNodeStore.getRecipeAncestors(PAPA_JOHNS.id)).toEqual([PAPA_JOHNS, NY_STYLE, NEAPOLITAN]);
    });

    test('RecipeNodeStore should delete child and children from recipe', async () => {
        nonBranchingPizzaSetup();

        await RecipeNodeStore.deleteRecipeAndChildren(NY_STYLE.id);

        const papaJohnsRecipeNode = await RecipeNodeStore.getRecipeNodeById(PAPA_JOHNS.id);
        expect(papaJohnsRecipeNode).toEqual(undefined);

        const nyStyleRecipeNode = await RecipeNodeStore.getRecipeNodeById(NY_STYLE.id);
        expect(nyStyleRecipeNode).toEqual(undefined);

        const neapolitanRecipeNode = await RecipeNodeStore.getRecipeNodeById(NEAPOLITAN.id);
        expect(neapolitanRecipeNode).toEqual(NEAPOLITAN);
    });

    test('RecipeNodeStore should delete child and children from recipe on branching setup', async () => {
        branchingPizzaSetup();

        await RecipeNodeStore.deleteRecipeAndChildren(NY_STYLE.id);

        const papaJohnsRecipeNode = await RecipeNodeStore.getRecipeNodeById(PAPA_JOHNS.id);
        expect(papaJohnsRecipeNode).toEqual(undefined);

        const nyStyleRecipeNode = await RecipeNodeStore.getRecipeNodeById(NY_STYLE.id);
        expect(nyStyleRecipeNode).toEqual(undefined);

        const newHavenStyleRecipeNode = await RecipeNodeStore.getRecipeNodeById(NEW_HAVEN_STYLE.id);
        expect(newHavenStyleRecipeNode).toEqual(undefined);

        const neapolitanRecipeNode = await RecipeNodeStore.getRecipeNodeById(NEAPOLITAN.id);
        expect(neapolitanRecipeNode).toEqual(NEAPOLITAN);
    });

    test('RecipeNodeStore should update a recipe node successfully', async () => {
        // Add a recipe node to the store
        const originalRecipe = new RecipeNode(
            "test-id-123",
            "None",
            "Original Recipe",
            new ChangeList<Ingredient>().add(new Ingredient("Original Ingredient", "G", 100), 0),
            new ChangeList<Direction>().add(new Direction("Original Direction"), 0)
        );
        await RecipeNodeStore.addRecipeNode(originalRecipe);

        // Create an updated version of the recipe
        const updatedRecipe = new RecipeNode(
            "test-id-123",
            "None",
            "Updated Recipe Name",
            new ChangeList<Ingredient>().add(new Ingredient("Updated Ingredient", "G", 200), 0),
            new ChangeList<Direction>().add(new Direction("Updated Direction"), 0)
        );

        // Update the recipe
        const updateCount = await RecipeNodeStore.updateRecipeNode(updatedRecipe);

        // Verify update was successful
        expect(updateCount).to.equal(1);

        // Retrieve the updated recipe and verify its contents
        const retrievedRecipe = await RecipeNodeStore.getRecipeNodeById("test-id-123");
        expect(retrievedRecipe).not.to.be.undefined;
        expect(retrievedRecipe?.name).to.equal("Updated Recipe Name");
        expect(retrievedRecipe?.ingredients.items[0].content?.name).to.equal("Updated Ingredient");
        expect(retrievedRecipe?.ingredients.items[0].content?.amount).to.equal(200);
        expect(retrievedRecipe?.directions.items[0].content?.content).to.equal("Updated Direction");
    });

    test('RecipeNodeStore should return 0 when updating a non-existent recipe node', async () => {
        const nonExistentRecipe = new RecipeNode(
            "non-existent-id",
            "None",
            "Non-existent Recipe",
            new ChangeList<Ingredient>(),
            new ChangeList<Direction>()
        );

        const updateCount = await RecipeNodeStore.updateRecipeNode(nonExistentRecipe);

        expect(updateCount).to.equal(0);
    });
});
