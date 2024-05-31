import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescription from "./GroupDescription";
import GroupUsers from "./GroupUsers";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEventBus } from "@/EventBus";

const ConversationHeader = ({ selectedConversation }) => {
    const page = usePage();
    const auth = page.props.auth;
    const { emit } = useEventBus();

    const deleteGroup = () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this group? This action is irreversible."
            )
        ) {
            return;
        }

        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                emit("toast.show", res.data.message);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <>
            {selectedConversation && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}

                        <div className="flex items-center gap-2">
                            <div className="text-lg font-medium">
                                {selectedConversation.name}
                            </div>
                            {selectedConversation.is_group && (
                                <div className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedConversation.is_group && (
                        <div className="flex items-center gap-3">
                            <GroupDescription
                                description={selectedConversation.description}
                            />
                            <GroupUsers users={selectedConversation.users} />

                            {selectedConversation.owner_id == auth.user.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit group"
                                    >
                                        <button
                                            className="dark:text-gray-400 text-gray-800 dark:hover:text-gray-200 hover:text-gray-600"
                                            onClick={(e) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete group"
                                    >
                                        <button
                                            className="dark:text-gray-400 text-gray-800 dark:hover:text-gray-200 hover:text-gray-600"
                                            onClick={deleteGroup}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
