import Container from "../components/Container";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Headers from "../components/Headers";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostsGrid from "../components/PostsGrid";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const POST_URL = "/posts";

const Home = () => {
  const [showFav, setShowFav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextCursor, setNextCursor] = useState();
  const [previousCursor, setPreviousCursor] = useState();
  const [count, setCount] = useState();
  const limit = 16;
  const [pageNo, setPageNo] = useState(1);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(undefined);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagList, setTagList] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getPosts(POST_URL.concat(showFav ? "?showFav=true" : ""));
    getTags();
  }, [showFav, showModal]);

  useEffect(() => {
    if (selectedTag !== undefined)
      getPosts(POST_URL.concat(selectedTag ? `?tag=${selectedTag}` : ""));
  }, [selectedTag]);

  const getTags = async () => {
    const controller = new AbortController();
    if (!showModal) {
      try {
        const response = await axiosPrivate.get("/tags", {
          signal: controller.signal,
        });
        setTags(response.data);
        setTagList(response.data.slice(0, 8));
        setIsLoaded(true);
      } catch (error) {
        console.error(error.response);
        toast.error(error.response.data.detail);
      }
    }
  };

  const getPosts = async (endpoint) => {
    const controller = new AbortController();
    if (!showModal) {
      try {
        const response = await axiosPrivate.get(endpoint, {
          signal: controller.signal,
        });
        setPosts(response.data?.results);
        setNextCursor(response?.data?.next);
        setPreviousCursor(response?.data?.previous);
        setCount(response.data.count);
        setIsLoaded(true);
      } catch (error) {
        console.error(error.response);
        toast.error(error.response?.data.detail);
      }
    }
  };

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
      {isLoaded && tags.length !== 0 && (
        <div className="mt-4 flex items-center">
          <h2 className="font-semibold text-lg mr-4">Tags:</h2>
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 flex-wrap">
              {tagList.map((tag) => (
                <button
                  className={`
                border
                py-1 px-4 
                ${
                  selectedTag === tag.name
                    ? "bg-gray-900 text-white border-transparent"
                    : "bg-gray-300 text-gray-900 border-gray-900 "
                }
                hover:bg-gray-900 hover:text-white hover:border-transparent
                rounded-full`}
                  onClick={() =>
                    selectedTag === tag.name
                      ? setSelectedTag("")
                      : setSelectedTag(tag.name)
                  }
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            <FontAwesomeIcon
              icon={showAllTags ? faChevronUp : faChevronDown}
              size="lg"
              className="cursor-pointer"
              onClick={() => {
                setShowAllTags(!showAllTags);
                !showAllTags ? setTagList(tags) : setTagList(tags.slice(0, 8));
              }}
            />
          </div>
        </div>
      )}

      {showModal && (
        <Modal title="Upload image" setShowModal={setShowModal}>
          {<ModalForm setShowModal={setShowModal} tags={tags} />}
        </Modal>
      )}
      {posts.length !== 0 && isLoaded ? (
        <PostsGrid posts={posts} />
      ) : (
        <p className="text-center mt-16 text-4xl text-gray-400">No images</p>
      )}
      {posts.length !== 0 && isLoaded && (
        <div className="mt-4 pb-8 flex justify-between items-center">
          <div className="text-gray-500 font-medium text-sm">
            Showing {pageNo * limit - limit + 1} to{" "}
            {Math.min(pageNo * limit, count)} of {count} results
          </div>
          <div className="flex gap-3">
            <button
              className={`bg-transparent text-gray-500 font-medium text-sm  py-2 px-4 border border-gray-300 rounded ${
                !previousCursor
                  ? "cursor-not-allowed focus:outline-none disabled:opacity-75"
                  : "hover:bg-gray-700 hover:text-white hover:border-transparent"
              }`}
              onClick={() => {
                setPageNo(pageNo - 1);
                return getPosts(previousCursor);
              }}
              disabled={!previousCursor}
            >
              Previous
            </button>
            <button
              className={`bg-transparent text-gray-500 font-medium text-sm  py-2 px-4 border border-gray-300 rounded ${
                !nextCursor
                  ? "cursor-not-allowed focus:outline-none disabled:opacity-75"
                  : "hover:bg-gray-700 hover:text-white hover:border-transparent"
              }`}
              onClick={() => {
                setPageNo(pageNo + 1);
                return getPosts(nextCursor);
              }}
              disabled={!nextCursor}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;
