const PostsGrid = ({ posts }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      {posts.map((post) => (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="h-64">
            <img
              className="object-cover h-64 w-full rounded-lg cursor-pointer"
              src={post.image}
              widths={[400, 600, 1024]}
              sizes="(max-width: 400px) 400px, (max-width: 600px) 600, 1024px"
              aspectRatio="5:3"
              alt={post.title}
            />
          </div>
          <div class="px-2 py-4 font-bold text-xl">{post.title}</div>
        </div>
      ))}
    </div>
  );
};

export default PostsGrid;

{
  /* <img class="h-auto max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png" alt="image description"> */
}
