import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/20/solid";

const UserOptionDropdown = ({ conversation }) => {
    const blockUser = () => {
        if (!conversation.is_user) {
            return;
        }

        axios
            .post(route("user.block", conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const changeUserRole = () => {
        if (!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.changeRole", conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
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
                            "absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50"
                        }
                    >
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={blockUser}
                                    className={
                                        `${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        }` +
                                        " group flex rounded-md items-center w-full px-2 py-2 text-sm"
                                    }
                                >
                                    {conversation.blocked_at && (
                                        <>
                                            <LockOpenIcon className="w-5 h-5 mr-2" />
                                            Unblock user
                                        </>
                                    )}
                                    {!conversation.blocked_at && (
                                        <>
                                            <LockClosedIcon className="w-5 h-5 mr-2" />
                                            Block user
                                        </>
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={changeUserRole}
                                    className={
                                        `${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        }` +
                                        " group flex rounded-md items-center w-full px-2 py-2 text-sm"
                                    }
                                >
                                    {conversation.is_admin && (
                                        <>
                                            <UserIcon className="w-5 h-5 mr-2" />
                                            Make Regular User
                                        </>
                                    )}
                                    {!conversation.is_admin && (
                                        <>
                                            <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                            Make admin
                                        </>
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default UserOptionDropdown;
