import {RecipeNode} from "@/app/model/recipe-node";
import {v4 as uuid} from "uuid";

export const NEAPOLITAN = new RecipeNode(uuid(), null, "Neapolitan", ["Flour", "Water", "Salt", "Yeast"], ["Mix it all together"])
export const NY_STYLE = new RecipeNode(uuid(), NEAPOLITAN.id, "Ny Style", ["Olive Oil"], ["Roll it out way bigger"])
export const PAPA_JOHNS = new RecipeNode(uuid(), NY_STYLE.id, "Papa Johns Style", ["Add a lot of sugar"], ["Mix the sugar in"]);

