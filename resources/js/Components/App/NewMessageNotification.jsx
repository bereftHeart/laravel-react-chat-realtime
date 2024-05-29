import React, { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import { v4 as uuidv4 } from "uuid";

const NewMessageNotification = () => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4();

            setToasts((prev) => [...prev, { message, user, group_id, uuid }]);

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
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-3"
                    >
                        <UserAvatar user={toast.user} />
                        <span className="dark:text-gray-200 font-semibold">
                            {toast.message}
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NewMessageNotification;
