import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";

export class Recipe {
    id: string; // nodeId
    parentId: string;
    name: string;
    ingredients: Ingredient[];
    directions: Direction[];

    constructor(id: string, parentId: string, name: string, ingredients: Ingredient[], directions: Direction[]) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}
