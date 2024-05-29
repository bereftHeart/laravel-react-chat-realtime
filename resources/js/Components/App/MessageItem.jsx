import { usePage } from "@inertiajs/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helper";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

const MessageItem = ({ message, attachmentClick, online = null }) => {
    const currentUser = usePage().props.auth.user;

    return (
        <div
            className={`chat ${
                message.sender_id === currentUser.id ? "chat-end" : "chat-start"
            }`}
        >
            <UserAvatar user={message.sender} online={online} />
            <div className="chat-header">
                {message.sender_id !== currentUser.id
                    ? message.sender.name
                    : "You"}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>
            {message.message !== null && (
                <div
                    className={`chat-bubble relative ${
                        message.sender_id === currentUser.id
                            ? "chat-bubble-secondary"
                            : "chat-bubble-success"
                    }`}
                >
                    {message.sender_id == currentUser.id && (
                        <MessageOptionsDropdown message={message} />
                    )}
                    <div className="chat-message">
                        <div className="chat-message-content">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                        />
                    </div>
                </div>
            )}

            {message.message === null && message.attachments && (
                <MessageAttachments
                    attachments={message.attachments}
                    attachmentClick={attachmentClick}
                />
            )}
        </div>
    );
};

export default MessageItem;
