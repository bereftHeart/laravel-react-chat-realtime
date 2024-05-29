import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";

const AudioRecorder = ({ fileReady }) => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }
        setRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            newMediaRecorder.addEventListener("stop", () => {
                const blob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                const audioFile = new File([blob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });
                const url = URL.createObjectURL(audioFile);
                fileReady(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.error(error);
        }
    };
    return (
        <button
            onClick={startRecording}
            className="p-1 text-gray-400 hover:text-gray-300 relative"
        >
            {recording ? (
                <StopCircleIcon className="w-5 h-5 text-red-400" />
            ) : (
                <MicrophoneIcon className="w-5 h-5" />
            )}
        </button>
    );
};

export default AudioRecorder;
