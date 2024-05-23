import { UserGroupIcon } from "@heroicons/react/24/solid";

const GroupAvatar = () => {
    return (
        <div className="avatar placeholder">
            <div className="bg-gray-400 text-gray-800 rounded-full w-10">
                <UserGroupIcon className="w-5 h-5" />
            </div>
        </div>
    );
};

export default GroupAvatar;
