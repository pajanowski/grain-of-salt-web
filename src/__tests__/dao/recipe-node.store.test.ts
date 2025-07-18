import {expect, test } from 'vitest'
import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data";
import "fake-indexeddb/auto";
import {RecipeNode} from "@/app/model/recipe-node";
import {branchingPizzaSetup, nonBranchingPizzaSetup} from '../misc';

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
})

