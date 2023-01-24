import { useState } from "react";
import { axiosPrivate } from "../api/axios";
import InputField from "./InputField";
import { toast } from "react-toastify";

const POST_URL = "/posts";

const ModalForm = ({ setShowModal }) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();

  const uploadImage = async (e) => {
    e.preventDefault();
    const controller = new AbortController();

    var data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("image", image);
    try {
      await axiosPrivate.post(POST_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal,
      });
      toast.success("Image uploaded successfully");
      setShowModal(false);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.detail);
    }
  };

  return (
    <div className="relative p-6 flex-auto">
      <form encType="multipart/form-data" onSubmit={uploadImage}>
        <InputField
          id="title"
          name="title"
          inputType="text"
          placeholder="Enter title"
          label="Title"
          handleChange={(e) => setTitle(e.target.value)}
        />
        <InputField
          id="description"
          name="description"
          inputType="text"
          placeholder="Description"
          label="Description"
          handleChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg, image/svg"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button
            className="hover:bg-gray-900 bg-gray-700 font-semibold text-white py-2 px-4 hover:border-transparent rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalForm;
