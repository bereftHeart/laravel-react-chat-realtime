import { useEventBus } from "@/EventBus";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Toast = ({}) => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidv4();

            setToasts((prev) => [...prev, { message, uuid }]);

            setTimeout(() => {
                setToasts((prev) =>
                    prev.filter((toast) => toast.uuid !== uuid)
                );
            }, 5000);
        });
    }, [on]);
    return (
        <div className="toast toast-top toast-end">
            {toasts.map((toast) => (
                <div key={toast.uuid} className="alert alert-info">
                    <span className="dark:text-gray-300 text-gray-800 font-semibold">
                        {toast.message}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
