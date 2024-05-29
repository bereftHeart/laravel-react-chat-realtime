export const formatMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(now, inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(now, inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleString("default", {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleString("default", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    }
};

const isToday = (now, date) => {
    return (
        now.getDate() === date.getDate() &&
        now.getMonth() === date.getMonth() &&
        now.getFullYear() === date.getFullYear()
    );
};

const isYesterday = (now, date) => {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        yesterday.getDate() === date.getDate() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getFullYear() === date.getFullYear()
    );
};

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")[0];
    return mime.toLowerCase() === "image";
};

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")[0];
    return mime.toLowerCase() === "audio";
};

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")[0];
    return mime.toLowerCase() === "video";
};

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    return mime === "application/pdf";
};

export const isPreviewAble = (attachment) => {
    return (
        isImage(attachment) ||
        isAudio(attachment) ||
        isVideo(attachment) ||
        isPDF(attachment)
    );
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
