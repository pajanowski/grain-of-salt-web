import {RecipeNodeStore} from "@/app/dao/recipe-node.store";
import {NEAPOLITAN, NEW_HAVEN_STYLE, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";

export const nonBranchingPizzaSetup = () => {
    RecipeNodeStore.addRecipeNode(NEAPOLITAN);

    RecipeNodeStore.addRecipeNode(NY_STYLE);

    RecipeNodeStore.addRecipeNode(PAPA_JOHNS);
}

export const branchingPizzaSetup = () => {
    nonBranchingPizzaSetup()    // child of ^
    // child of NY_STYLE
    RecipeNodeStore.addRecipeNode(NEW_HAVEN_STYLE);
}