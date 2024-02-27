export async function POST(request: Request) {
  const { title, content, imageId } = await request.json(); // Include imageId

  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.split(" ")[1];

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
      content,
      status: "PUBLISH",
    },
  };

  if (!authToken) {
    return new Response(JSON.stringify({ message: "Auth token is missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch("https://sardinie.web-devtesting.xyz/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query: CREATE_POST_MUTATION, variables }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify({ message: "Failed to create post", errors: responseData.errors }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // New logic to update the ACF field with the imageId, if provided
  if (imageId && responseData.data.createPost.post.id) {
    await updateACFFieldForPost(responseData.data.createPost.post.id, imageId, authToken);
  }

  return new Response(JSON.stringify({ message: "Post created successfully", data: responseData.data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// New function to update the ACF field for the post
async function updateACFFieldForPost(postId, imageId, authToken) {
  // Assuming ACF update is possible via a REST API or similar
  // Replace URL and field_key with your actual data
  const acfEndpoint = `https://sardinie.web-devtesting.xyz/wp-json/acf/v3/posts/${postId}`;
  const acfFieldKey = "field_65da4b646dc42"; // You need to replace this with your actual ACF field key
  const response = await fetch(`${acfEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      fields: {
        [acfFieldKey]: imageId,
      },
    }),
  });

  if (!response.ok) {
    console.error("Failed to update ACF field");
    // Handle error
  }
}
