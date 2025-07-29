import {PencilIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/solid";

interface FormRowContextButtonsProps {
    children?: React.ReactNode;
    addCallback: () => void;
    editCallback?: () => void;
    removeCallBack?: () => void;
}
const FormRowContextButtons = (props: FormRowContextButtonsProps) => {
    const buttonStyle = "bg-gray-300 hover:bg-gray-500 rounded-sm p-1";
    return (
        <div className="flex flex-col group w-full p-2 gap-2 bg-gray-200 rounded-md">
            {props.children}
            <div className={"hidden group-hover:flex w-full justify-center gap-2"}>
                <button className={buttonStyle} onClick={props.addCallback}>
                    <PlusIcon className="size-6 text-black"/>
                </button>
                {props.editCallback && (
                    <button className={buttonStyle} onClick={props.editCallback}>
                        <PencilIcon className="size-6 text-black" />
                    </button>
                )}
                {props.removeCallBack && (
                    <button className={buttonStyle} onClick={props.removeCallBack}>
                        <TrashIcon className="size-6 text-black" />
                    </button>
                )}
            </div>
        </div>
    )
};

export default FormRowContextButtons;
