import React, {forwardRef, useImperativeHandle, useCallback} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {RecipeNode} from "@/app/model/recipe-node";
import {RecipeService} from "@/app/service/recipe.service";
import {Ingredient} from "@/app/model/ingredient";
import {ChangeList} from "@/app/model/change.list";
import {Direction} from "@/app/model/direction";
import {Add} from "@/app/model/change";
import {v4 as uuid} from 'uuid';

export interface RecipeFormHandle {
    getRecipeNodeFromForm: () => RecipeNode;
    submitRecipeNode: () => Promise<unknown>;
}

export interface RecipeFormProps {
    onSubmit?: (recipeNode: RecipeNode) => Promise<unknown>;
    ref: unknown
}

const RecipeForm = forwardRef<RecipeFormHandle, RecipeFormProps>((props, ref) => {
    const { register, control, handleSubmit, getValues, formState: { errors } } = useForm<RecipeNode>({
        defaultValues: {
            name: "",
            ingredients: new ChangeList<Ingredient>(),
            directions: new ChangeList<Direction>()
        }
    });

    const ingredientFields = useFieldArray({
        control,
        name: "ingredients.items"
    });

    const directionFields = useFieldArray({
        name: "directions.items",
        control
    });

    const onSubmit = (data: unknown) => {
        console.log(data);
        if (props.onSubmit) {
            props.onSubmit(data as RecipeNode);
        }
    };

    const addIngredient = useCallback(() => {
        ingredientFields.append({
            changeType: 'Add',
            content: new Ingredient("", "", 0),
            line: ingredientFields.fields.length
        });
    }, [ingredientFields]);

    const addDirection = useCallback(() => {
        directionFields.append({
            changeType: 'Add',
            content: new Direction(""),
            line: directionFields.fields.length
        });
    }, [directionFields]);

    const moveIngredientUp = useCallback((index: number) => {
        if (index > 0) {
            ingredientFields.move(index, index - 1);
        }
    }, [ingredientFields]);

    const moveIngredientDown = useCallback((index: number) => {
        if (index < ingredientFields.fields.length - 1) {
            ingredientFields.move(index, index + 1);
        }
    }, [ingredientFields]);

    const moveDirectionUp = useCallback((index: number) => {
        if (index > 0) {
            directionFields.move(index, index - 1);
        }
    }, [directionFields]);

    const moveDirectionDown = useCallback((index: number) => {
        if (index < directionFields.fields.length - 1) {
            directionFields.move(index, index + 1);
        }
    }, [directionFields]);

    useImperativeHandle(ref, () => {
        return {
            getRecipeNodeFromForm(): RecipeNode {
                const values = getValues();
                return new RecipeNode(
                    uuid(),
                    null,
                    values.name,
                    values.ingredients,
                    values.directions
                );
            },
            submitRecipeNode(): Promise<unknown> {
                const recipeNodeFromForm = this.getRecipeNodeFromForm();
                return RecipeService.saveRootRecipe(recipeNodeFromForm);
            }
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Recipe Name</label>
                <input 
                    type="text" 
                    placeholder="Recipe Name" 
                    {...register("name", {required: true})} 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.name && <span className="text-red-500 text-xs italic">Recipe name is required</span>}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Ingredients</h3>
                    <button 
                        type="button" 
                        onClick={addIngredient}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                        Add Ingredient
                    </button>
                </div>

                {ingredientFields.fields.map((item, index) => (
                    <div key={item.id} className="flex flex-row gap-2 mb-2 items-center">
                        <div className="flex flex-col">
                            <button 
                                type="button" 
                                onClick={() => moveIngredientUp(index)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-t text-sm"
                            >
                                ↑
                            </button>
                            <button 
                                type="button" 
                                onClick={() => moveIngredientDown(index)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-b text-sm"
                            >
                                ↓
                            </button>
                        </div>

                        <input 
                            type="text" 
                            placeholder="Name" 
                            {...register(`ingredients.items.${index}.content.name`, {required: true})} 
                            className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            {...register(`ingredients.items.${index}.content.amount`, {required: true, valueAsNumber: true})} 
                            className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <input 
                            type="text" 
                            placeholder="Unit" 
                            {...register(`ingredients.items.${index}.content.unit`, {required: true})} 
                            className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />

                        <button 
                            type="button" 
                            onClick={() => ingredientFields.remove(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {ingredientFields.fields.length === 0 && (
                    <p className="text-gray-500 italic">No ingredients added yet.</p>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Directions</h3>
                    <button 
                        type="button" 
                        onClick={addDirection}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                        Add Direction
                    </button>
                </div>

                {directionFields.fields.map((item, index) => (
                    <div key={item.id} className="flex flex-row gap-2 mb-2 items-start">
                        <div className="flex flex-col mt-2">
                            <button 
                                type="button" 
                                onClick={() => moveDirectionUp(index)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-t text-sm"
                            >
                                ↑
                            </button>
                            <button 
                                type="button" 
                                onClick={() => moveDirectionDown(index)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-b text-sm"
                            >
                                ↓
                            </button>
                        </div>

                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-bold mb-1">Step {index + 1}</label>
                            <textarea 
                                placeholder="Direction" 
                                {...register(`directions.items.${index}.content.content`, {required: true})} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={3}
                            />
                        </div>

                        <button 
                            type="button" 
                            onClick={() => directionFields.remove(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm mt-6"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {directionFields.fields.length === 0 && (
                    <p className="text-gray-500 italic">No directions added yet.</p>
                )}
            </div>

            {props.onSubmit && (
                <button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit Recipe
                </button>
            )}
        </form>
    );
});

RecipeForm.displayName = "RecipeForm";

export default RecipeForm;
