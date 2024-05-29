import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    return (
        <button className="p-1 text-gray-400 hover:text-gray-300 relative">
            {recording ? (
                <StopCircleIcon className="w-5 h-5" />
            ) : (
                <MicrophoneIcon className="w-5 h-5" />
            )}
        </button>
    );
};

export default AudioRecorder;
