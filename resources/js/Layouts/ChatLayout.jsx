import { router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { useEventBus } from "@/EventBus";
import GroupModal from "@/Components/App/GroupModal";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    // console.log("selectedConversation", selectedConversation);

    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);

    const [onlineUsers, setOnlUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const isOnline = (userID) => onlineUsers[userID];

    const { on, emit } = useEventBus();

    // listen to change on conversations
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // sort conversations by last message date when it changes
    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else return 0;
            })
        );
    }, [localConversations]);

    // update newest message of the conversations on the sidebar
    const messageUpdated = (message) => {
        setLocalConversations((prevMsg) => {
            // check if the message is for the selected conversation
            return prevMsg.map((prev) => {
                if (
                    message.receiver_id &&
                    !prev.is_group &&
                    (prev.id == message.receiver_id ||
                        prev.id == message.sender_id)
                ) {
                    prev.last_message = message.message;
                    prev.last_message_date = message.created_at;
                    return prev;
                }

                // check if the message is for the selected group
                if (
                    message.group_id &&
                    prev.is_group &&
                    prev.id == message.group_id
                ) {
                    prev.last_message = message.message;
                    prev.last_message_date = message.created_at;
                    return prev;
                }

                return prev;
            });
        });
    };

    const messageDeleted = ({ prevLastMessage }) => {
        messageUpdated(prevLastMessage);
    };
    // change the conversations when a new message is created
    useEffect(() => {
        const offCreated = on("message.created", messageUpdated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offShowGroupModal = on("GroupModal.show", () => {
            setShowGroupModal(true);
        });
        const offGroupDelete = on("group.deleted", ({ id, name }) => {
            // remove the group from the list of conversations
            setLocalConversations((prev) => {
                return prev.filter((conv) => conv.id !== id);
            });

            emit("toast.show", `Group "${name}" was deleted successfully`);

            if (
                !selectedConversation ||
                (selectedConversation.is_group && selectedConversation.id == id)
            ) {
                router.visit(route("dashboard"));
            }
        });
        return () => {
            offCreated();
            offDeleted();
            offShowGroupModal();
            offGroupDelete();
        };
    }, [on]);

    // handle current users on the channel "online"
    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlUserUpdate = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlUsers((prevOnlUsers) => {
                    return { ...prevOnlUsers, ...onlUserUpdate };
                });
                // console.log("here", users);
            })
            .joining((user) => {
                // add joining user
                setOnlUsers((prev) => {
                    return {
                        ...prev,
                        [user.id]: user,
                    };
                });
                // console.log("joining", user);
            })
            .leaving((user) => {
                // delete leaving user
                setOnlUsers((prev) => {
                    delete { ...prev }[user.id];
                    return { ...prev };
                });
                // console.log("leaving", user);
            })
            .error((error) => {
                console.log("error", error);
            });
        return () => {
            Echo.leave("online");
        };
    }, []);

    // search
    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    return (
        <>
            <div className="flex-1 flex w-full overflow-hidden">
                {/* conversations at side bar */}
                <div
                    className={`w-full transition-all sm:w-[220px] md:w-[300px] bg-slate-300 dark:bg-slate-800 
                    flex flex-col overflow-hidden ${
                        selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200">
                        <h4>My conversations</h4>
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new group"
                        >
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <PencilSquareIcon className="w-5 h-5 inline-block ml-2" />
                            </button>
                        </div>
                    </div>

                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full"
                        ></TextInput>
                    </div>
                    {/* conversations */}
                    <div className="flex-1 overflow-auto no-scrollbar">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    selectedConversation={selectedConversation}
                                    online={!!isOnline(conversation.id)}
                                />
                            ))}
                    </div>
                </div>
                {/* main message */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </div>

            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};

export default ChatLayout;
