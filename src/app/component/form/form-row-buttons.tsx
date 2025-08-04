import React from "react";

interface FormRowButtonsProps {
    index: number;
    removeCallback: (index?: number) => void;
    confirmCallback: (index: number) => void;
    valid: boolean;
    testIdPrefix?: string;
}

const FormRowButtons = (props: FormRowButtonsProps) => {
    const index = props.index;
    const prefix = props.testIdPrefix || 'ingredient';
    return (
        <div>
            <button
                type="button"
                onClick={() => props.removeCallback(index)}
                data-testid={`${prefix}-remove-button-${index}`}
                className="bg-gray-200 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded text-sm"
            >
                🗑
            </button>
            <button
                type="button"
                onClick={() => props.confirmCallback(index)}
                data-testid={`${prefix}-confirm-button-${index}`}
                disabled={!props.valid}
                className="bg-gray-200 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded text-sm"
            >
                ✅
            </button>
        </div>
    )
}

export default FormRowButtons;
