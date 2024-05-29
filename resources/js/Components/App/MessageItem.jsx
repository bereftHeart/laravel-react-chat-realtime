import { usePage } from "@inertiajs/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helper";
import MessageAttachments from "./MessageAttachments";

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
            <div
                className={`chat-bubble relative ${
                    message.sender_id === currentUser.id
                        ? "chat-bubble-secondary"
                        : "chat-bubble-success"
                }`}
            >
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                    />
                </div>

                {/* {message.attachment && (
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => attachmentClick(message.attachment)}
                    >
                        <div className="text-xs text-gray-500">
                            {message.attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                            {message.attachment.size} bytes
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default MessageItem;
