import {Recipe} from "@/app/model/recipe";
import React, {RefObject, useMemo, useRef, useState} from "react";
import {RecipeFormHandle} from "@/app/component/form/recipe.form";
import {useForm} from "react-hook-form";
import {RecipeNode} from "@/app/model/recipe-node";
import {ChangeList} from "@/app/model/change.list";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";
import {randomUUID} from "node:crypto";
import IngredientForm from "@/app/component/form/ingredient.form";
import {v4 as uuid} from "uuid";
import {Change, ChangeType} from "@/app/model/change";
import DirectionForm from "@/app/component/form/direction.form";

interface RecipeFormV2Props {
    recipe?: Recipe,
    ref?: RefObject<RecipeFormHandle>,
    onSubmit?: (recipeNode: RecipeNode) => void,
}

const RecipeFormV2 = (props: RecipeFormV2Props) => {
    const recipe = props.recipe;
    const [recipeNode, setRecipeNode] = useState<RecipeNode>(new RecipeNode());
    const [ingredients, setIngredients] = useState<Change<Ingredient>[]>([]);
    const [directions, setDirections] = useState<Change<Direction>[]>([]);

    useMemo(() => {
        const ingredientChangeList = new ChangeList<Ingredient>(recipe?.ingredients);
        const directionChangeList = new ChangeList<Direction>(recipe?.directions);
        setRecipeNode(new RecipeNode(
            uuid(),
            recipe?.id,
            recipe?.name,
            ingredientChangeList,
            directionChangeList,
        ));
        setIngredients(ingredientChangeList.items);
        setDirections(directionChangeList.items);
    }, [recipe]);
    const { register, control, handleSubmit, getValues, formState: { errors } } = useForm<RecipeNode>({
        defaultValues: recipeNode
   });
    const onSubmit = (data: unknown) => {
        console.log(data);
        if (props.onSubmit) {
            props.onSubmit(data as RecipeNode);
        }
    };

    const getChangeBackground = (changeType: ChangeType) => {
      return changeType == 'Add' ? "bg-green-300" : "bg-red-300"
  }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Recipe Name</label>
                <input
                    type="text"
                    placeholder="Recipe Name"
                    data-testid="recipe-name-input"
                    {...register("name", {required: true})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.name && <span className="text-red-500 text-xs italic">Recipe name is required</span>}
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients</label>
            {ingredients && ingredients.map(ingredient => (
                    <div key={ingredient.content?.id} className={"flex flex-row gap-2 justify-between " + getChangeBackground(ingredient.changeType)}>
                        <div>{ingredient.content?.name}</div>
                        <div className={"flex flex-row gap-2"}>
                            <div>{ingredient.content?.amount}</div>
                            <div>{ingredient.content?.unit}</div>
                        </div>
                    </div>
            ))}
            <IngredientForm line={ingredients.length}
                            removeCallback={() => {}}
                            confirmCallback={(ingredient) => {
                                setIngredients([
                                    ...ingredients,
                                    new Change('Add', ingredient, ingredients.length)
                                ])
                            }}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2">Directions</label>
            {directions && directions.map(direction=> (
                    <div key={direction.content?.id} className={"flex flex-row gap-2 justify-between " + getChangeBackground(direction.changeType)}>
                        {direction.content?.content}
                    </div>
            ))}
            <DirectionForm line={directions.length}
                            removeCallback={() => {}}
                            confirmCallback={(direction) => {
                                setDirections([
                                    ...directions,
                                    new Change('Add', direction, directions.length)
                                ]);
                            }}
            />
        </form>
    )

};

export default RecipeFormV2;
