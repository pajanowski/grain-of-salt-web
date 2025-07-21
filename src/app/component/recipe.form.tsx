import React from 'react';
import { useForm } from 'react-hook-form';

export default function RecipeForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: unknown) => console.log(data);
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <input type="text" placeholder="Recipe Name" {...register("Recipe Name", {required: true})} />
            <input type="text" placeholder="Description" {...register("Description", {required: true})} />
            <input type="text" placeholder="Ingredient Name" {...register("Ingredient Name", {required: true})} />
            <input type="number" placeholder="Ingredient Amount" {...register("Ingredient Amount", {required: true})} />
            <input type="text" placeholder="Ingredient Unit" {...register("Ingredient Unit", {required: true})} />
            <input type="text" placeholder="Direction" {...register("Direction", {required: true})} />

            <input type="submit" />
        </form>
    );
}