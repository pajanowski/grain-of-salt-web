import {RecipeNode} from "@/app/model/recipe-node";
import {v4 as uuid} from "uuid";

export const NEAPOLITAN = new RecipeNode(uuid(), 'None', "Neapolitan", ["Flour", "Water", "Salt", "Yeast"], ["Mix it all together"])
export const NY_STYLE = new RecipeNode(uuid(), NEAPOLITAN.id, "Ny Style", ["Olive Oil"], ["Roll it out way bigger"])
export const NEW_HAVEN_STYLE = new RecipeNode(uuid(), NY_STYLE.id, "New Haven Style", ["Olive Oil"], ["Roll it out way bigger and thinner and cook it way hotter"])
export const PAPA_JOHNS = new RecipeNode(uuid(), NY_STYLE.id, "Papa Johns Style", ["Add a lot of sugar"], ["Mix the sugar in"]);

