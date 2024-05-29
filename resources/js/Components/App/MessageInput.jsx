import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import NewMessageInput from "./NewMessageInput";
import { Popover } from "@headlessui/react";
import { Fragment } from "react";
import EmojiPicker from "emoji-picker-react";
import { isImage, isAudio, isPDF, isVideo, isPreviewAble } from "@/helper";
import CustomAudioPlayer from "./CustomAudioPlayer";
import AttachmentPreview from "./AttachmentPreview";
import AudioRecorder from "./AudioRecorder";

const MessageInput = ({ conversation = null, messagesCtrRef = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessages, setInputErrorMessages] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onSend = () => {
        if (messageSending) return;
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessages("Please enter a message or upload a file");
            setTimeout(() => {
                setInputErrorMessages("");
            }, 3000);
            return;
        }
        // prepare form data
        const formatData = new FormData();
        chosenFiles.forEach((file) => {
            formatData.append("attachments[]", file.file);
        });
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
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                // console.log(response.data);
                setMessageSending(false);
                setNewMessage("");
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                setMessageSending(false);
                setChosenFiles([]);
                const message = error?.response?.data?.message;
                setInputErrorMessages(
                    message || "An error occurred while sending message"
                );
                setTimeout(() => {
                    setInputErrorMessages("");
                }, 3000);
            });
    };

    const likeClick = () => {
        if (messageSending) return;
        const data = {
            message: "👍",
        };
        // check if conversation is user or group
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data).then((res) => {
            console.log(res.data);
        });
    };

    const onFileChange = (e) => {
        const files = e.target.files;
        const updateFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        setChosenFiles((prevFiles) => [...prevFiles, ...updateFiles]);
    };

    return (
        <div className="flex flex-wrap items-start py-3 border-t border-slate-700">
            {/* file upload button */}
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative cursor-pointer">
                    <PaperClipIcon className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 "
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative cursor-pointer">
                    <PhotoIcon className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 opacity-0 "
                    />
                </button>
                <AudioRecorder />
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
                {!!uploadProgress && uploadProgress !== 100 && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {inputErrorMessages && (
                    <div className="text-red-500 text-xs mt-1">
                        {inputErrorMessages}
                    </div>
                )}
                {/* files preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.length > 0 &&
                        chosenFiles.map((file, index) => (
                            <div
                                key={index}
                                className={`relative flex justify-between cursor-pointer  ${
                                    !isImage(file.file) ? "w-[240px]" : ""
                                }`}
                            >
                                {isImage(file.file) && (
                                    <img
                                        src={file.url}
                                        alt={file.file.name}
                                        className="w-12 h-12 object-cover"
                                    />
                                )}

                                {isAudio(file.file) && (
                                    <CustomAudioPlayer
                                        file={file}
                                        showVolume={false}
                                    />
                                )}

                                {!isImage(file.file) && !isAudio(file.file) && (
                                    <AttachmentPreview file={file} />
                                )}

                                <button
                                    onClick={() => {
                                        setChosenFiles(
                                            chosenFiles.filter(
                                                (f) => f !== file
                                            )
                                        );
                                    }}
                                    className="absolute w-6 h-6 rounded-full -top-2 -right-2 bg-black text-gray-400 hover:text-red-500"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
            {/* emoji */}
            <div className="order-3 xs:order-3 flex items-center p-2">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-5 h-5" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 p-2 right-0 bottom-full bg-slate-800 rounded shadow-lg">
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(e) =>
                                setNewMessage(newMessage + e.emoji)
                            }
                        />
                    </Popover.Panel>
                </Popover>

                <button
                    onClick={likeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
