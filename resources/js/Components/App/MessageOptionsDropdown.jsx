import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEventBus } from "@/EventBus";

const MessageOptionsDropdown = ({ message }) => {
    const { emit } = useEventBus();

    const deleteMessage = () => {
        axios.delete(route("message.destroy", message.id)).then((response) => {
            emit("message.deleted", {
                message: message,
                prevLastMessage: response.data.message,
            });
        });
    };

    return (
        <div className="absolute z-10 right-full top-1/2 -translate-y-1/2 dark:text-slate-300">
            <Menu as="div" className={"relative inline-block text-left"}>
                <Menu.Button
                    className={"flex items-center justify-center w-8 h-8"}
                >
                    <EllipsisVerticalIcon className={"w-5 h-5"} />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-75"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Menu.Items
                        className={
                            "absolute right-0 mt-2 rounded-md bg-gray-800 shadow-lg z-50"
                        }
                    >
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={deleteMessage}
                                    className={
                                        `${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        }` +
                                        " group flex rounded-md items-center w-full px-4 py-2 text-sm"
                                    }
                                >
                                    <TrashIcon className="w-5 h-5 mr-2" />
                                    Delete
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default MessageOptionsDropdown;
