import React, {forwardRef} from "react";
import FormRowButtons from "@/app/component/form/form-row-buttons";
import {useForm} from "react-hook-form";
import {Ingredient} from "@/app/model/ingredient";
import {v4 as uuid} from "uuid";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IngredientFormHandle {

}

export interface IngredientFormProps {
    line: number,
    removeCallback: (index: number) => void;
    confirmCallback: (ingredient: Ingredient) => void;
    ingredient?: Ingredient;
}

const IngredientForm = forwardRef<IngredientFormHandle, IngredientFormProps>((props: IngredientFormProps, _ref) => {
    const { register, control, handleSubmit, getValues, formState: { errors }, reset } = useForm<Ingredient>({
        defaultValues: {
            id: props.ingredient?.id ?? uuid(),
            name: props.ingredient?.name ?? "",
            amount: props.ingredient?.amount ?? undefined,
            unit: props.ingredient?.unit ?? ""
        }
    });
    return (
        <div className="flex flex-row gap-2">
            <input
                type="text"
                placeholder="Name"
                data-testid={`ingredient-name-input-${props.line}`}
                {...register(`name`, {required: true})}
                className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
                type="number"
                placeholder="Amount"
                data-testid={`ingredient-amount-input-${props.line}`}
                {...register(`amount`, {required: true, valueAsNumber: true})}
                className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
                type="text"
                placeholder="Unit"
                data-testid={`ingredient-unit-input-${props.line}`}
                {...register(`unit`, {required: true})}
                className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <FormRowButtons index={props.line}
                            removeCallback={() => props.removeCallback}
                            confirmCallback={() => {
                                const values = getValues();
                                props.confirmCallback(new Ingredient(
                                    values.name,
                                    values.unit,
                                    values.amount,
                                ));
                                reset()
                            }}
                            testIdPrefix="ingredient"
                            valid={!errors.unit && !errors.name && !errors.amount}/>
        </div>
    )
});

IngredientForm.displayName = "IngredientForm";

export default IngredientForm;
