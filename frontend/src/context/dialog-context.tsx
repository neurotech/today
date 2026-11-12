import { createContext, type ReactNode, useCallback, useState } from "react";

type DialogMeta = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    body?: ReactNode;
    onClose?: () => void;
};

type DialogContextType = {
    setDialog: ({ open, message, body, onConfirm, onClose }: DialogMeta) => void;
    dialog: DialogMeta;
    close: () => void;
};

const defaultValues: DialogContextType = {
    setDialog: () => {},
    dialog: {
        open: false,
        message: "",
        title: "",
        onConfirm: () => {},
    },
    close: () => {},
};

export const DialogContext = createContext<DialogContextType>(defaultValues);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialog, setDialog] = useState<DialogMeta>(defaultValues.dialog);

    const close = useCallback(() => {
        setDialog({ open: false, title: "", message: "", onConfirm: () => {} });
        dialog.onClose?.();
    }, [dialog.onClose]);

    return (
        <DialogContext.Provider value={{ dialog, setDialog, close }}>
            {children}
        </DialogContext.Provider>
    );
};
