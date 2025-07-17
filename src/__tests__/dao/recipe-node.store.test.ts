import {expect, test } from 'vitest'
import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {NEAPOLITAN, NY_STYLE, PAPA_JOHNS} from "@/app/static-data";

test('RecipeNodeStore should return an empty recipe node', () => {
  const actual = RecipeNodeStore.getRootRecipes();
  expect(actual).toStrictEqual(new Set())
})

test('RecipeNodeStore should return recipe nodes after they are put in there', () => {
  nonBranchingPizzaSetup();

  const rootRecipeIds = RecipeNodeStore.getRootRecipes();
  expect(rootRecipeIds).toContain(NEAPOLITAN.id)
  expect(rootRecipeIds).to.not.contain(NY_STYLE.id);
  expect(rootRecipeIds).to.not.contain(PAPA_JOHNS.id);

});

test('RecipeNodeStore should return only recipe nodes asked for', () => {
  nonBranchingPizzaSetup();

  expect(RecipeNodeStore.getRecipeNodeById("asdf")).to.equal(undefined);
  expect(RecipeNodeStore.getRecipeNodeById(NEAPOLITAN.id)).to.equal(NEAPOLITAN);
  expect(RecipeNodeStore.getRecipeNodeById(NY_STYLE.id)).to.equal(NY_STYLE);
  expect(RecipeNodeStore.getRecipeNodeById(PAPA_JOHNS.id)).to.equal(PAPA_JOHNS);
});

test('RecipeNodeStore should only return the ancestors of nodes when asked for', () => {
  nonBranchingPizzaSetup();

  expect(RecipeNodeStore.getRecipeAncestors("asdf")).toStrictEqual([]);
  expect(RecipeNodeStore.getRecipeAncestors(NEAPOLITAN.id)).toStrictEqual([NEAPOLITAN]);
  expect(RecipeNodeStore.getRecipeAncestors(NY_STYLE.id)).toStrictEqual([NY_STYLE, NEAPOLITAN]);
  expect(RecipeNodeStore.getRecipeAncestors(PAPA_JOHNS.id)).toStrictEqual([PAPA_JOHNS, NY_STYLE, NEAPOLITAN]);
})

const nonBranchingPizzaSetup = () => {
  const parentId = NEAPOLITAN.id;
  const parentNode = NEAPOLITAN;
  RecipeNodeStore.addRootRecipeNode(parentNode);

  const child1Id = NY_STYLE.id;
  const child1Node = NY_STYLE;
  RecipeNodeStore.addRecipeNode(child1Node);

  const child2Id = NY_STYLE.id;
  const child2Node = PAPA_JOHNS;
  RecipeNodeStore.addRecipeNode(child2Node);
}
