export async function POST(request: Request) {
  const { title, content, imageId } = await request.json();
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.split(" ")[1];

  // Initialize imageUrl to an empty string
  let imageUrl = "";

  if (imageId && authToken) {
    // Use the correct WordPress REST API endpoint for media
    const mediaUrl = `https://sardinie.web-devtesting.xyz/wp-json/wp/v2/media/${imageId}`;

    const mediaResponse = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!mediaResponse.ok) {
      // If the fetch call fails, log the error and return a response
      console.error("Failed to fetch image data");
      return new Response(
        JSON.stringify({ message: "Failed to fetch image data" }),
        {
          status: mediaResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse the response data and extract the source_url
    const mediaData = await mediaResponse.json();
    imageUrl = mediaData.source_url; // This is the URL of the uploaded image
    console.log("Image URL:", imageUrl);
  }

  // Embed the image URL within the content of the post
  const contentWithImage = imageUrl
    ? `<p><img src="${imageUrl}" alt="Uploaded Image" /><br />${content}</p>`
    : content;

  // Log contentWithImage for debugging
  console.log("Content with Image:", contentWithImage);

  const CREATE_POST_MUTATION = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        post {
          id
          title
          date
        }
      }
    }
  `;

  const variables = {
    input: {
      clientMutationId: "CreatePost",
      title,
      content: contentWithImage,
      status: "PUBLISH",
    },
  };

  if (!authToken) {
    return new Response(JSON.stringify({ message: "Auth token is missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const graphqlResponse = await fetch(
    "https://sardinie.web-devtesting.xyz/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ query: CREATE_POST_MUTATION, variables }),
    }
  );

  if (!graphqlResponse.ok) {
    const errorText = await graphqlResponse.text();
    return new Response(
      JSON.stringify({ message: "Failed to create post", error: errorText }),
      {
        status: graphqlResponse.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const graphqlData = await graphqlResponse.json();

  return new Response(
    JSON.stringify({
      message: "Post created successfully",
      data: graphqlData.data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
