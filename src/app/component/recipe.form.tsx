import React, {forwardRef, useImperativeHandle} from 'react';
import { useForm } from 'react-hook-form';
import {RecipeNode} from "@/app/model/recipe-node";
import {RecipeService} from "@/app/service/recipe.service";

export interface RecipeFormHandle {
    getRecipeNodeFromForm: () => RecipeNode;
    submitRecipeNode: () => Promise<unknown>;
}

export interface RecipeFormProps {
    onSubmit?: (recipeNode: RecipeNode) => Promise<unknown>;
    ref: unknown
}

const RecipeForm = forwardRef<RecipeFormHandle, RecipeFormProps>((props, ref) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: unknown) => console.log(data);

    useImperativeHandle(ref, () => {
        return {
            getRecipeNodeFromForm(): RecipeNode {
                return new RecipeNode("asdf", "asdf", "asdf");
            },
            submitRecipeNode(): Promise<unknown> {
                return RecipeService.saveRecipeNode(this.getRecipeNodeFromForm());
            }
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <input type="text" placeholder="Recipe Name" {...register("Recipe Name", {required: true})} />
            <input type="text" placeholder="Description" {...register("Description", {required: true})} />
            <input type="text" placeholder="Ingredient Name" {...register("Ingredient Name", {required: true})} />
            <input type="number" placeholder="Ingredient Amount" {...register("Ingredient Amount", {required: true})} />
            <input type="text" placeholder="Ingredient Unit" {...register("Ingredient Unit", {required: true})} />
            <input type="text" placeholder="Direction" {...register("Direction", {required: true})} />

            {/*If onSubmit is provided, assume that are handling the submit from the form*/}
            {/*Else, assume its being handled elsewhere with the submitRecipeNode handle*/}
            {props.onSubmit &&
                <input type="submit" />
            }
        </form>
    );
});

RecipeForm.displayName = "RecipeForm";

export default RecipeForm;