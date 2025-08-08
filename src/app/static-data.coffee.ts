import {NONE_PARENT_ID, RecipeNode} from "@/app/model/recipe-node";
import {v4 as uuid} from "uuid";
import {ChangeList} from "@/app/model/change.list";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";

export const PHILLS_STANDARD_COFFEE = new RecipeNode(
    uuid(),
    NONE_PARENT_ID,
    "Phill's Standard Coffee",
    new ChangeList<Ingredient>().add(
        new Ingredient("Coffee Grounds", "G", 20),
        0
    ).add(
        new Ingredient("Boiling Water", "G", 400),
        1
    ).add(
        new Ingredient("Sugar", "G", 10),
        2
    ),
    new ChangeList<Direction>().add(
        new Direction("Put pour over onto cup"),
        0
    ).add(
        new Direction("Put filter in pour over"),
        1
    ).add(
        new Direction("Put grounds in filter"),
        2
    ).add(
        new Direction("Pour boiling water over coffee"),
        3
    ).add(
        new Direction("Wait for coffee to brew"),
        4
    ).add(
        new Direction("Stir sugar into coffee"),
        5
    )
)

export const PHILLS_FANCY_COFFEE = new RecipeNode(
    uuid(),
    PHILLS_STANDARD_COFFEE.id,
    "Phill's Fancy Coffee",
    new ChangeList<Ingredient>().remove(0)
        .add(
            new Ingredient("Fancy Coffee Grounds", "G", 22),
            0
        )
)
export const PHILLS_DUNKIN_COFFEE = new RecipeNode(
    uuid(),
    PHILLS_STANDARD_COFFEE.id,
    "Phill's DUNKIN Coffee",
    new ChangeList<Ingredient>().remove(0)
        .add(
            new Ingredient("Dunkin Coffee Grounds", "G", 20),
            0
        ).remove(2)
        .add(
            new Ingredient("Sugar", "G", 12),
            2
        )
)
export const PHILLS_WORK_COFFEE = new RecipeNode(
    uuid(),
    PHILLS_DUNKIN_COFFEE.id,
    "Phill's Work Coffee",
    new ChangeList<Ingredient>().remove(0)
        .add(
            new Ingredient("Dunkin Coffee Grounds", "G", 35),
            0
        )
        .remove(1)
        .add(
            new Ingredient("Boiling Water", "G", 650),
            1
        )
        .remove(2)
        .add(
            new Ingredient("Sugar", "G", 20),
            2
        ),
    new ChangeList<Direction>().add(
        new Direction("The night before, measure out coffee, set out filter, and fill kettle."),
        0
    )
)
