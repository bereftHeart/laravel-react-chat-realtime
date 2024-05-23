import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import NewMessageInput from "./NewMessageInput";

const MessageInput = ({ conversation = null, messagesCtrRef = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessages, setInputErrorMessages] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const onSend = () => {
        if (messageSending) return;
        if (newMessage.trim() === "") {
            setInputErrorMessages("Please enter a message or upload a file");
            setTimeout(() => {
                setInputErrorMessages("");
            }, 3000);
            return;
        }
        // prepare form data
        const formatData = new FormData();
        formatData.append("message", newMessage);
        // check if conversation is user or group
        if (conversation.is_user) {
            formatData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formatData.append("group_id", conversation.id);
        }

        setMessageSending(true);

        axios
            .post(route("message.store"), formatData, {
                // show progress
                onUploadProgress: (progressEvent) => {
                    // calculate progress percentage
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    // log progress
                    // console.log(progress);
                },
            })
            .then((response) => {
                // console.log(response.data);
                setMessageSending(false);
                setNewMessage("");
            })
            .catch((error) => {
                setMessageSending(false);
                console.log(error);
            });
    };

    return (
        <div className="flex flex-wrap items-start py-3 border-t border-slate-700">
            {/* file upload button */}
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            {/* message input */}
            <div className="relative order-1 xs:order-2 flex-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onSend={onSend}
                    />
                    <button
                        onClick={onSend}
                        disabled={messageSending}
                        className="btn btn-info rounded-l-none"
                    >
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2">Send</span>
                    </button>
                </div>
                {/* error messages */}
                {inputErrorMessages && (
                    <div className="text-red-500 text-xs mt-1">
                        {inputErrorMessages}
                    </div>
                )}
            </div>
            {/* emoji */}
            <div className="order-3 xs:order-3 flex-none p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300">
                    <FaceSmileIcon className="w-5 h-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
