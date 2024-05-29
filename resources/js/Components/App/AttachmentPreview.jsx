import { formatBytes, isPDF, isPreviewAble } from "@/helper";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import React from "react";

const AttachmentPreview = ({ file }) => {
    return (
        <div className="flex items-center w-full gap-2 py-2 px-3 rounded-md bg-slate-200 dark:bg-slate-800">
            <div>
                {isPDF(file.file) && (
                    <img src="/img/png.png" alt=".pdf file" className="w-8" />
                )}

                {!isPreviewAble(file.file) && (
                    <div className="flex justify-center items-center w-10 h-10 rounded bg-slate-300 dark:bg-slate-700">
                        <PaperClipIcon className="w-6 h-6 text-gray-500" />
                    </div>
                )}
            </div>

            <div className="flex-1 text-nowrap text-ellipsis overflow-hidden">
                <h3>{file.file.name}</h3>
                <p className="text-xs">{formatBytes(file.file.size)}</p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
