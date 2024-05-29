import { isAudio, isImage, isPDF, isPreviewAble, isVideo } from "@/helper";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import CustomAudioPlayer from "./CustomAudioPlayer";

const AttachmentPreviewModal = ({
    attachments,
    index,
    show,
    onClose = () => {},
}) => {
    console.log(attachments);
    const [currentIndex, setCurrentIndex] = useState(index);
    const attachment = useMemo(() => {
        return attachments[currentIndex];
    }, [currentIndex, attachments]);

    const previewAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewAble(attachment));
    }, [attachments]);

    const close = () => {
        onClose();
    };

    const prevIndex = () => {
        setCurrentIndex((prev) => {
            if (prev === 0) {
                return previewAttachments.length - 1;
            }
            return prev - 1;
        });
    };

    const nextIndex = () => {
        setCurrentIndex((prev) => {
            if (prev === previewAttachments.length - 1) {
                return 0;
            }
            return prev + 1;
        });
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="relative z-50"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25"></div>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="h-screen w-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="flex flex-col w-full h-full bg-slate-500 dark:bg-slate-800 transform overflow-hidden text-left align-middle shadow-xl transition-all">
                                <button
                                    onClick={close}
                                    className="absolute z-40 right-3 top-3 w-10 h-10 rounded-full hover:bg-black/10 transition flex items-center justify-center text-gray-700 dark:text-white"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <div className="relative group h-full">
                                    {currentIndex != "0" && (
                                        <button
                                            onClick={prevIndex}
                                            className="absolute z-30 top-1/2 left-4 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 hover:bg-black/25 text-gray-700 dark:text-gray-100 hover:text-gray-300"
                                        >
                                            <ChevronLeftIcon className="w-16 h-16" />
                                        </button>
                                    )}
                                    {currentIndex !=
                                        previewAttachments.length - 1 && (
                                        <button
                                            onClick={nextIndex}
                                            className="absolute z-30 top-1/2 right-4 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 hover:bg-black/25 text-gray-700 dark:text-gray-100 hover:text-gray-300"
                                        >
                                            <ChevronRightIcon className="w-16 h-16" />
                                        </button>
                                    )}

                                    {attachment && (
                                        <div className="flex items-center justify-center w-full h-full p-4">
                                            {isImage(attachment) && (
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    className="max-w-full max-h-full"
                                                />
                                            )}

                                            {isVideo(attachment) && (
                                                <div className="flex items-center">
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                        className="max-w-full max-h-full"
                                                    ></video>
                                                </div>
                                            )}

                                            {isAudio(attachment) && (
                                                <div className="relative flex items-center justify-center">
                                                    <audio
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></audio>
                                                </div>
                                            )}

                                            {isPDF(attachment) && (
                                                <iframe
                                                    src={attachment.url}
                                                    className="w-full h-full"
                                                ></iframe>
                                            )}

                                            {!isPreviewAble(attachment) && (
                                                <div className="flex flex-col p-32 justify-center items-center">
                                                    <PaperClipIcon className="w-16 h-16 mb-3 text-gray-700 dark:text-gray-100" />
                                                    <small>
                                                        {attachment.name}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AttachmentPreviewModal;
