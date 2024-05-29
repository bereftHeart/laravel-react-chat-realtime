import { isAudio, isImage, isPDF, isPreviewAble, isVideo } from "@/helper";
import {
    ArrowDownTrayIcon,
    PaperClipIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import React from "react";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end mt-2">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className={
                                `group flex flex-col items-center justify-center relative cursor-pointer ` +
                                (isAudio(file)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-blue-100")
                            }
                            onClick={() => attachmentClick(attachments, index)}
                        >
                            {!isAudio(file) && (
                                <a
                                    onClick={(e) => e.stopPropagation()}
                                    download={file.name}
                                    href={file.url}
                                    title="download"
                                    className="absolute top-0 right-0 z-10 group-hover:opacity-100 translate-all w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded cursor-pointer"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </a>
                            )}

                            {isImage(file) && (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="object-contain aspect-square"
                                />
                            )}

                            {isVideo(file) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="w-16 h-16 text-white opacity-70 absolute z-20" />
                                    <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/50"></div>
                                    <video
                                        src={file.url}
                                        className="aspect-square"
                                        controls
                                    ></video>
                                </div>
                            )}

                            {isAudio(file) && (
                                <div className="relative flex justify-center items-center">
                                    <audio src={file.url} controls></audio>
                                </div>
                            )}
                            {isPDF(file) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute inset-0"></div>
                                    <iframe
                                        src={file.url}
                                        frameborder="0"
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}
                            {!isPreviewAble(file) && (
                                <a
                                    onClick={(e) => e.stopPropagation()}
                                    download={file.name}
                                    href={file.url}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <PaperClipIcon className="w-8 h-8 mb-3" />
                                    <small className="text-center">
                                        {file.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
