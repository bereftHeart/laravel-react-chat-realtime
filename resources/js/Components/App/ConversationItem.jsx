import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionDropdown from "./UserOptionDropdown";
import { formatMessageDateLong } from "@/helper";

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const user = page.props.auth.user;
    let classes =
        "border-transparent flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30 ";
    if (selectedConversation) {
        if (
            !selectedConversation.is_group &&
            !conversation.is_group &&
            selectedConversation.id === conversation.id
        ) {
            classes = `${classes}!border-sky-400 bg-black/20`;
        }

        if (
            selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.id === conversation.id
        ) {
            classes = `${classes}!border-lime-400 bg-black/20`;
        }
    }
    return (
        <Link
            href={
                conversation.is_group
                    ? route("chat.group", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={
                "conversation-item " +
                classes +
                (conversation.is_user && user.is_admin ? "pr-2" : "pr-4")
            }
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}
            {conversation.is_group && <GroupAvatar />}
            <div
                className={`flex-1 text-xs max-w-full overflow-hidden ${
                    conversation.is_user && conversation.blocked_at
                        ? "opacity-50"
                        : ""
                }`}
            >
                <div className="flex gap-1 items-center justify-between">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {conversation.last_message_date && (
                        <span className="text-nowrap text-xs hidden md:block">
                            {formatMessageDateLong(
                                conversation.last_message_date
                            )}
                        </span>
                    )}
                </div>
                {conversation.last_message ? (
                    <p className="text-nowrap text-xs overflow-hidden text-ellipsis">
                        {conversation.last_message}
                    </p>
                ) : (
                    conversation.last_message_date && (
                        <p className="text-nowrap text-xs overflow-hidden text-ellipsis italic">
                            Send an attachment
                        </p>
                    )
                )}
            </div>
            {user.is_admin && conversation.is_user ? (
                <UserOptionDropdown conversation={conversation} />
            ) : null}
        </Link>
    );
};

export default ConversationItem;
