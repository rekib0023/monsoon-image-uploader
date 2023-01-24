import Container from "../components/Container";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Headers from "../components/Headers";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostsGrid from "../components/PostsGrid";

const POST_URL = "/posts";

const Home = () => {
  const [showFav, setShowFav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    const getPosts = async () => {
      try {
        if (!showModal) {
          const response = await axiosPrivate.get(
            POST_URL.concat(showFav ? "?showFav=true" : ""),
            {
              signal: controller.signal,
            }
          );
          setPosts(response.data);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error(error.response);
        toast.error(error.response.data.detail);
      }
    };
    getPosts();
  }, [showFav, showModal]);

  return (
    <Container>
      <Headers setShowModal={setShowModal} />
      <div>
        <button
          className={`text-lg mt-16 bg-transparent hover:border-b-2 text-gray-900 py-2 px-4 w-1/2 border-gray-900 ${
            !showFav ? "border-b-2" : ""
          }`}
          onClick={() => setShowFav(false)}
        >
          All
        </button>
        <button
          className={`text-lg mt-16 bg-transparent hover:border-b-2 text-gray-900 py-2 px-4 w-1/2 border-gray-900 ${
            showFav ? "border-b-2" : ""
          }`}
          onClick={() => setShowFav(true)}
        >
          Favourites
        </button>
      </div>
      {showModal && (
        <Modal title="Upload image" setShowModal={setShowModal}>
          {<ModalForm setShowModal={setShowModal} />}
        </Modal>
      )}
      {posts && isLoaded ? (
        <PostsGrid posts={posts} />
      ) : (
        <p className="text-center mt-16 text-4xl text-gray-400">No images</p>
      )}
    </Container>
  );
};

export default Home;
