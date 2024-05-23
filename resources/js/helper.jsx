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
