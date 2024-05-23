const UserAvatar = ({ user, online = false, profile = false }) => {
    let onlineClass = online ? "online" : "offline";
    const sizeClass = profile ? "h-40 w-40" : "h-10 w-10";
    return (
        <>
            {user.avatar_url && (
                <div
                    className={`chat-image avatar + ${
                        !profile ? onlineClass : ""
                    }`}
                >
                    <div className={"rounded-full " + sizeClass}>
                        <img src={user.avatar_url} />
                    </div>
                </div>
            )}

            {!user.avatar_url && (
                <div
                    className={`chat-image avatar placeholder + ${
                        !profile ? onlineClass : ""
                    }`}
                >
                    <div className={"bg-gray-400 rounded-full " + sizeClass}>
                        <span className="text-xl text-gray-800">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
