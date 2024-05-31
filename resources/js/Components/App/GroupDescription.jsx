import { Popover, Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";

const GroupDescription = ({ description }) => {
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
                        <ExclamationCircleIcon className="w-5 h-5" />
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
                        <Popover.Panel className="absolute right-0 z-20 w-[200px] px-4 sm:px-0 mt-2">
                            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg ring-1 ring-black/5">
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-center mb-2">
                                        Group Description
                                    </h3>
                                    <p className="py-4 text-sm">
                                        {description || "No description"}
                                    </p>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default GroupDescription;
