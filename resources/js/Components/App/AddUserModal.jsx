import { useEventBus } from "@/EventBus";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import UserPicker from "./UserPicker";
import Checkbox from "../Checkbox";

const AddUserModal = ({ show = false, onClose = () => {} }) => {
    const { emit } = useEventBus();

    const { data, setData, processing, reset, post, errors } = useForm({
        id: "",
        name: "",
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("user.store"), {
            onSuccess: () => {
                emit("toast.show", `User ${data.name} created successfully`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={submit}
                className="p-6 overflow-y-auto no-scrollbar"
            >
                <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Create new user
                </h2>

                <div className="mb-4">
                    <InputLabel htmlFor="name" value="Group Name" />
                    <TextInput
                        id="name"
                        className="my-1 w-full block"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        isFocused
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="my-1 w-full block"
                        value={data.email || ""}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="mb-4">
                    <label className="flex items-center ">
                        <Checkbox
                            name="is_admin"
                            checked={data.is_admin}
                            onChange={(e) =>
                                setData("is_admin", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-700 dark:text-gray-300">
                            Make admin
                        </span>
                    </label>
                    <InputError message={errors.is_admin} />
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
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddUserModal;
