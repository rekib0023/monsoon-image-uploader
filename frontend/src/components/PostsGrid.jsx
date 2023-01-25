import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Modal from "./Modal";
import { LazyLoadImage } from "react-lazy-load-image-component";

import {
  faHeart as faHeartAlt,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const POST_URL = "/posts";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const PostsGrid = ({ posts }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState();

  const updateCurrentPost = (post) => {
    setShowModal(true);
    setCurrentPost(post);
  };
  const axiosPrivate = useAxiosPrivate();

  const favouritePost = async (id) => {
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.patch(
        POST_URL + `/${id}/`,
        JSON.stringify({
          isFavourite: !currentPost.isFavourite,
        }),
        {
          signal: controller.signal,
        }
      );
      toast.success(
        `Image ${currentPost.isFavourite ? "unliked" : "liked"} successfully`
      );
      setCurrentPost(response.data);
      await delay(800);
      window.location.reload(false);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.detail);
    }
  };

  const deletePost = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(POST_URL + `/${id}/`, {
        signal: controller.signal,
      });
      toast.info(`Image deleted successfully`);

      setShowModal(false);
      await delay(800);
      window.location.reload(false);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.detail);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      {posts.map((post) => (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="h-64">
            <LazyLoadImage
              className="object-cover h-64 w-full rounded-lg cursor-pointer"
              src={post.image}
              widths={[400, 600, 1024]}
              sizes="(max-width: 400px) 400px, (max-width: 600px) 600, 1024px"
              alt={post.title}
              onClick={() => updateCurrentPost(post)}
            />
          </div>
          <div className="px-2 py-4">
            <div className=" font-bold text-xl">{post.title}</div>
            <div className="flex gap-2 mt-2 font-medium text-sm text-sky-800">
              {post.tags.map((tag) => (
                <p>#{tag}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
      {showModal && (
        <Modal title="Image detail" setShowModal={setShowModal}>
          <div className="rounded overflow-hidden shadow-lg">
            <div className="h-96">
              <img
                className="object-contain h-96 w-full rounded-lg cursor-pointer"
                src={currentPost.image}
                widths={[400, 600, 1024]}
                sizes="(max-width: 400px) 400px, (max-width: 600px) 600, 1024px"
                alt={currentPost.title}
              />
            </div>
            <div className="px-5 py-4 ">
              <div className="flex">
                <div className="font-bold text-3xl mb-2">
                  {currentPost.title}
                </div>
                <div className="ml-auto flex gap-6 h-8">
                  <FontAwesomeIcon
                    icon={currentPost.isFavourite ? faHeart : faHeartAlt}
                    color="red"
                    size="lg"
                    onClick={() => favouritePost(currentPost.id)}
                    className="cursor-pointer"
                  />
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => deletePost(currentPost.id)}
                  />
                </div>
              </div>
              <div className="py-4">
                <p className="">{currentPost.description}</p>
                <div className="flex gap-2 mt-2 font-medium text-sm text-sky-800">
                  {currentPost.tags.map((tag) => (
                    <p>#{tag}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostsGrid;
