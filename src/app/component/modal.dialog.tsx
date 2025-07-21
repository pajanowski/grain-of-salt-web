import {createPortal} from "react-dom";
import React, {useEffect} from "react";
import {RecipeNode} from "@/app/model/recipe-node";
import Dexie from "dexie";
import Promise = Dexie.Promise;

export interface ModalDialogProps {
    onClose: () => void,
    children: React.ReactNode,
    onConfirm?: () => void
}

export const ModalDialog = ({onClose, children, onConfirm}: ModalDialogProps) => {
    // Add event listener for Escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        // Prevent scrolling on body when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col">
                    <div className="mb-4">
                        {children}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
