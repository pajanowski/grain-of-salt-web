import {Recipe} from "@/app/model/recipe";
import React, {forwardRef, RefObject, useImperativeHandle, useMemo, useState} from "react";
import {RecipeFormHandle} from "@/app/component/form/recipe.form";
import {useForm} from "react-hook-form";
import {NONE_PARENT_ID, RecipeNode} from "@/app/model/recipe-node";
import {ChangeList} from "@/app/model/change.list";
import {Ingredient} from "@/app/model/ingredient";
import {Direction} from "@/app/model/direction";
import IngredientForm from "@/app/component/form/ingredient.form";
import {v4 as uuid} from "uuid";
import {Change, ChangeType} from "@/app/model/change";
import DirectionForm from "@/app/component/form/direction.form";
import FormRowContextButtons from "@/app/component/form/form-row-context-buttons";
import {RecipeService} from "@/app/service/recipe.service";

interface RecipeFormV2Props {
    recipe?: Recipe,
    ref?: RefObject<RecipeFormHandle>,
    onSubmit?: (recipeNode: RecipeNode) => void,
}

const RecipeFormV2 = forwardRef<RecipeFormHandle, RecipeFormV2Props>((props: RecipeFormV2Props, ref) => {
    const recipe = props.recipe;
    const [recipeNode, setRecipeNode] = useState<RecipeNode>(new RecipeNode());
    const [ingredients, setIngredients] = useState<Change<Ingredient>[]>([]);
    const [directions, setDirections] = useState<Change<Direction>[]>([]);
    const [activeIngredientFormIndex, setActiveIngredientFormIndex] = useState(-1);
    const [activeDirectionFormIndex, setActiveDirectionFormIndex] = useState(-1);

    useImperativeHandle(ref, () => {
        return {
            getRecipeNodeFromForm(): RecipeNode {
                const values = getValues();
                return new RecipeNode(
                    uuid(),
                    NONE_PARENT_ID,
                    values.name,
                    ChangeList.from<Ingredient>(ingredients),
                    ChangeList.from<Direction>(directions),
                );
            },
            submitRecipeNode(): Promise<unknown> {
                const recipeNodeFromForm = this.getRecipeNodeFromForm();
                return RecipeService.saveRootRecipe(recipeNodeFromForm);
            }
        }
    });

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
    const {register, handleSubmit, getValues, formState: {errors}} = useForm<RecipeNode>({
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

    function getDirectionForm(index: number) {
        return <DirectionForm line={index}
                              removeCallback={() => {
                                  setActiveDirectionFormIndex(-1)
                              }}
                              confirmCallback={(direction) => {
                                  directions.splice(index, 0, new Change("Add", direction, index));
                                  setDirections([
                                      ...directions,
                                  ]);
                                  setActiveDirectionFormIndex(-1);
                              }}
        />;
    }

    function getIngredientsForm(index: number) {
        return (
            <div>
                {index}
            <IngredientForm line={index}
                              removeCallback={() => {
                                  setActiveIngredientFormIndex(-1)
                              }}
                              confirmCallback={(ingredient) => {
                                  ingredients.splice(index, 0, new Change("Add", ingredient, index));
                                  setIngredients([
                                      ...ingredients,
                                  ]);
                                  setActiveIngredientFormIndex(-1);
                              }}
            />
            </div>
        );
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
            <FormRowContextButtons addCallback={() => setActiveIngredientFormIndex(0)}/>
            {activeIngredientFormIndex == 0 && getIngredientsForm(0)}
            {ingredients && ingredients.map(((ingredient, index) => (
                <div key={ingredient.content?.id}>
                    <FormRowContextButtons addCallback={() => {setActiveIngredientFormIndex(index + 1)}}
                                           editCallback={() => {setActiveIngredientFormIndex(index)}}
                                           removeCallBack={() => {
                                               switch (ingredient.changeType as ChangeType) {
                                                   case "Add":
                                                   case "Remove":
                                                       ingredients.splice(index, 1);
                                                       setIngredients([...ingredients]);
                                                       break;
                                                   case "Replace":
                                                   case "Noop":
                                                       ingredients.splice(index, 1, new Change("Remove", ingredient.content, index));
                                                       break;
                                               }
                                           }}
                    >
                        <div className={"flex flex-row justify-between " + getChangeBackground(ingredient.changeType)}>
                            <div>{ingredient.content?.name}</div>
                            <div className={"flex flex-row gap-2"}>
                                <div>{ingredient.content?.amount}</div>
                                <div>{ingredient.content?.unit}</div>
                            </div>
                        </div>
                    </FormRowContextButtons>
                    {index + 1 == activeIngredientFormIndex && (
                        <div>
                            {getIngredientsForm(index + 1)}
                        </div>
                    )}
                </div>
            )))}

            <label className="block text-gray-700 text-sm font-bold mb-2">Directions</label>
            <FormRowContextButtons addCallback={() => setActiveDirectionFormIndex(0)}/>
            {activeDirectionFormIndex == 0 && getDirectionForm(0)}
            {directions && directions.map(((direction, index) => (
                <div key={direction.content?.id}>
                    <FormRowContextButtons addCallback={() => {setActiveDirectionFormIndex(index + 1)}}
                                           editCallback={() => {setActiveDirectionFormIndex(index)}}
                                           removeCallBack={() => {
                                               console.log("")
                                               switch (direction.changeType as ChangeType) {
                                                   case "Add":
                                                   case "Remove":
                                                       directions.splice(index, 1);
                                                       setDirections([...directions]);
                                                       break;
                                                   case "Replace":
                                                   case "Noop":
                                                       directions.splice(index, 1, new Change("Remove", direction.content, index));
                                                       break;
                                               }
                                           }}
                    >
                        <div
                             className={"flex flex-row gap-2 justify-between " + getChangeBackground(direction.changeType)}
                        >
                            {direction.content?.content}
                        </div>
                    </FormRowContextButtons>
                    {index + 1 == activeDirectionFormIndex && (
                        <div>
                            {getDirectionForm(index + 1)}
                        </div>
                    )}
                </div>
            )))}
        </form>
    )

});

RecipeFormV2.displayName = "RecipeFormV2";

export default RecipeFormV2;
