import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import React, { useRef, useState } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const audio = audioRef.current;
        setVolume(e.target.value);
        audio.volume = e.target.value;
    };

    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    };

    const handelLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        audio.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md">
            <audio
                ref={audioRef}
                src={file.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handelLoadedMetadata}
            />
            <button className="btn" onClick={togglePlay}>
                {isPlaying ? (
                    <PauseCircleIcon className="w-6" />
                ) : (
                    <PlayCircleIcon className="w-6" />
                )}
            </button>
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            )}
            <input
                type="range"
                min="0"
                step="0.01"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
            />
        </div>
    );
};

export default CustomAudioPlayer;
