import React, {forwardRef} from "react";
import {Direction} from "@/app/model/direction";
import {useForm} from "react-hook-form";
import {v4 as uuid} from "uuid";
import FormRowButtons from "@/app/component/form/form-row-buttons";

export interface DirectionFormProps {
    line: number,
    removeCallback: () => void,
    confirmCallback: (direction: Direction) => void,
    direction?: Direction
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DirectionFormHandle {
}

const DirectionForm = forwardRef<DirectionFormHandle, DirectionFormProps>((props: DirectionFormProps, _ref) => {
    const {register, getValues, formState: {errors}, reset} = useForm<Direction>({
        defaultValues: {
            id: props.direction?.id ?? uuid(),
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            content: props.direction?.content ?? ""
        }
    });
    return (
        <div className="flex flex-row gap-2">
            <input
                type="text"
                placeholder="Directions"
                data-testid={`direction-input-${props.line}`}
                {...register(`content`, {required: true})}
                className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <FormRowButtons index={props.line}
                            removeCallback={() => props.removeCallback()}
                            confirmCallback={() => {
                                props.confirmCallback(new Direction(getValues().content))
                                reset();
                            }}
                            testIdPrefix="direction"
                            valid={!errors.content}/>
        </div>
    )

});

DirectionForm.displayName = "DirectionForm";

export default DirectionForm;
