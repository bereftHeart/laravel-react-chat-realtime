import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEventBus } from "@/EventBus";
import UserAvatar from "@/Components/App/UserAvatar";
import { Link } from "@inertiajs/react";

function Dashboard({
    messages = null,
    selectedConversation = null,
    receiver = null,
}) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const loadMoreInteract = useRef(null);
    const [noMoreMessage, setNoMoreMessage] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const { on } = useEventBus();

    // listen to change on messages
    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    // load more messages
    const loadMoreMessages = useCallback(() => {
        // get the first message at the top
        const firstMessage = localMessages[0];

        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then((response) => {
                if (response.data.data.length === 0) {
                    setNoMoreMessage(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const isAtTop = scrollHeight - scrollTop === clientHeight;

                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prev) => {
                    return [...response.data.data.reverse(), ...prev];
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [localMessages]);

    // listen to scroll on messages container
    useEffect(() => {
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 200px 0px",
            }
        );

        // observe the load more interact
        if (loadMoreInteract.current) {
            setTimeout(() => {
                observer.observe(loadMoreInteract.current);
            }, 100);
        }

        // cleanup
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    // listen to new message
    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);

        setScrollFromBottom(0);
        setNoMoreMessage(false);
        // cleanup
        return () => {
            offCreated();
        };
    }, [selectedConversation]);

    const messageCreated = (message) => {
        console.log(message);
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }

        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
    };

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-slate-200 text-2xl md:text-4xl p-16">
                        Select a conversation to start chatting
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto px-4 py-2"
                    >
                        {localMessages.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-lg text-slate-200">
                                    No messages yet
                                </div>
                            </div>
                        )}

                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                <div ref={loadMoreInteract}></div>
                                {noMoreMessage && receiver && (
                                    <div className="flex flex-col items-center text-sm text-slate-200 my-2 transition-all">
                                        <div className="flex flex-col items-center">
                                            <UserAvatar
                                                user={receiver.data}
                                                profile={true}
                                            />
                                            <div className="px-3 pt-4">
                                                {receiver.data.name}
                                            </div>
                                        </div>
                                        <Link href="#" className="btn btn-link">
                                            View profile
                                        </Link>
                                    </div>
                                )}
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={index}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput
                        conversation={selectedConversation}
                        messagesCtrRef={messagesCtrRef}
                    />
                </>
            )}
        </>
    );
}

Dashboard.layout = (page) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Chat
                </h2>
            }
        >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Dashboard;
