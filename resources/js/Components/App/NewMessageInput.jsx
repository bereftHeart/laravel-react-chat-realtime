import React, { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const input = useRef();

    // handle key down event
    const handleKeyDown = (e) => {
        // if enter key is pressed without shift key
        if (e.key === "Enter" && !e.shiftKey) {
            // prevent default
            e.preventDefault();
            // send message
            onSend();
        }
    };

    // handle change event
    const onChangeEvent = (e) => {
        setTimeout(() => {
            // adjust height of textarea
            adjustHeight(e);
        }, 10);
        onChange(e);
    };

    // adjust height of textarea based on content length
    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }, 10);
    };

    // listen to value change
    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows="1"
            onChange={onChangeEvent}
            onKeyDown={(e) => handleKeyDown(e)}
            className="input input-bordered w-full h-full max-h-40 rounded-r-none resize-none overflow-y-auto "
            placeholder="Type a message..."
        ></textarea>
    );
};

export default NewMessageInput;
