import { useEventBus } from "@/EventBus";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import UserPicker from "./UserPicker";
import TextArea from "../TextArea";

const GroupModal = ({ show = false, onClose = () => {} }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                id: group.id,
                name: group.name,
                description: group.description,
                user_ids: group.users
                    .filter((user) => user.id != group.owner_id)
                    .map((user) => user.id),
            });
            setGroup(group);
        });
    }, [on]);

    const { data, setData, processing, reset, put, post, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const users = conversations.filter((conv) => !conv.is_group);

    const closeModal = () => {
        reset();
        onClose();
    };

    const createOrUpdateGroup = (e) => {
        e.preventDefault();
        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit(
                        "toast.show",
                        `Group "${data.name}" was updated successfully`
                    );
                },
            });
        } else {
            post(route("group.store"), {
                onSuccess: () => {
                    closeModal();
                    emit(
                        "toast.show",
                        `Group "${data.name}" was created successfully`
                    );
                },
            });
        }
    };
    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 overflow-y-auto no-scrollbar"
            >
                <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
                    {group.id
                        ? `Edit Group "${group.name}"`
                        : "Create New Group"}
                </h2>

                <div className="mb-4">
                    <InputLabel htmlFor="name" value="Group Name" />

                    <TextInput
                        id="name"
                        className="my-1 w-full block"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        isFocused
                        required
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="description" value="Description" />

                    <TextArea
                        id="description"
                        className="my-1 w-full block"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />

                    <InputError message={errors.description} />
                </div>

                <div className="mb-4">
                    <InputLabel value="Select Users" />
                    <UserPicker
                        value={
                            users.filter(
                                (user) =>
                                    group.owner_id != user.id &&
                                    data.user_ids.includes(user.id)
                            ) || []
                        }
                        options={users}
                        onSelect={(users) =>
                            setData(
                                "user_ids",
                                users.map((user) => user.id)
                            )
                        }
                    />
                    <InputError message={errors.user_ids} />
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        disabled={processing}
                    >
                        {group.id ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default GroupModal;
