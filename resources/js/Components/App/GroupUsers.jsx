import { Popover, Transition } from "@headlessui/react";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";
import React, { Fragment } from "react";
import UserAvatar from "./UserAvatar";

const GroupUsers = ({ users }) => {
    return (
        <Popover className={"relative"}>
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`${
                            open
                                ? "text-gray-800 dark:text-gray-200"
                                : "text-gray-600 dark:text-gray-400"
                        } hover:text-gray-800 dark:hover:text-gray-200`}
                    >
                        <UserGroupIcon className="w-5 h-5" />
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-20 w-[300px] sm:px-0 px-4 mt-2">
                            <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ring-1 ring-black/5">
                                <div className="shadow p-2">
                                    <h3 className="text-lg font-bold mb-2 text-center">
                                        Group Users
                                    </h3>
                                    <div className="flex flex-col">
                                        {users.map((user) => (
                                            <Link
                                                href={route(
                                                    "chat.user",
                                                    user.id
                                                )}
                                                key={user.id}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors overflow-hidden"
                                            >
                                                <UserAvatar user={user} />
                                                <span className="text-nowrap text-ellipsis">
                                                    {user.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default GroupUsers;
