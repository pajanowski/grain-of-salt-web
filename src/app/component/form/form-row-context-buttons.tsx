import {PencilIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/solid";

interface FormRowContextButtonsProps {
    children?: React.ReactNode;
    addCallback?: () => void;
    editCallback?: () => void;
    removeCallBack?: () => void;
    testId?: string;
}
const FormRowContextButtons = (props: FormRowContextButtonsProps) => {
    const buttonStyle = "bg-gray-300 hover:bg-gray-500 rounded-sm p-1";
    const testId = props.testId || 'form-row-context';
    return (
        <div className={"flex flex-col group w-full p-2 gap-2 hover:border-gray-500 hover:border-2 bg-gray-200 rounded-md"}
             data-testid={`${testId}-container`}>
            {props.children}
            <div className={"hidden group-hover:block h-0 "}>
                <div className={"flex w-full justify-center gap-2"}>
                    {props.addCallback && (
                        <button className={buttonStyle} onClick={props.addCallback} data-testid={`${testId}-add-button`}>
                            <PlusIcon className="size-6 text-black"/>
                        </button>
                    )}
                    {props.editCallback && (
                        <button className={buttonStyle} onClick={props.editCallback} data-testid={`${testId}-edit-button`}>
                            <PencilIcon className="size-6 text-black" />
                        </button>
                    )}
                    {props.removeCallBack && (
                        <button className={buttonStyle} onClick={props.removeCallBack} data-testid={`${testId}-remove-button`}>
                            <TrashIcon className="size-6 text-black" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default FormRowContextButtons;
