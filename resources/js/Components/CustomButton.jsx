export default function CustomButton({
    color = "gray",
    className = "",
    disabled,
    children,
    ...props
}) {
    const baseClasses = `inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
        disabled && "opacity-25"
    }`;

    const colorClasses = {
        gray: "bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:ring-gray-500",
        red: "bg-red-800 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:ring-red-500",
        green: "bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:ring-green-500",
        blue: "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:ring-blue-500",
        // Add more colors as needed
    };

    const selectedColorClasses = colorClasses[color] || colorClasses.gray;

    return (
        <button
            {...props}
            className={`${selectedColorClasses} ${baseClasses} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
