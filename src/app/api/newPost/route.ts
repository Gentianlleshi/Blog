// app/api/newPost/route.ts
export async function POST(request: Request) {
  const { title, content, imageId } = await request.json();

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
  const postCreationResponse = await response.json();
  if (!response.ok) {
    return new Response(
      JSON.stringify({
        message: "Failed to create post",
        errors: responseData.errors,
      }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const newPostId = postCreationResponse.data.createPost.post.id;
  // Now, update the ACF field with the image ID
  try {
    await updateACFFieldForPost(newPostId, imageId, authToken);
    return new Response(
      JSON.stringify({
        message: "Post created and ACF field updated successfully",
        data: postCreationResponse.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Log the error and possibly handle it
    console.error(error);
    // You may want to return a different response here if the ACF update is critical
  }

  // New logic to update the ACF field with the imageId, if provided
  if (imageId && responseData.data.createPost.post.id) {
    await updateACFFieldForPost(
      responseData.data.createPost.post.id,
      imageId,
      authToken
    );
  }

  return new Response(
    JSON.stringify({
      message: "Post created successfully",
      data: responseData.data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function updateACFFieldForPost(
  postId: any,
  imageId: any,
  authToken: string
) {
  const acfEndpoint = `https://sardinie.web-devtesting.xyz/wp-json/acf/v3/posts/${postId}`;
  const acfFieldKey = "field_65da4b646dc42"; // Replace with your actual ACF field key
  const response = await fetch(acfEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include any necessary authentication headers
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      fields: {
        [acfFieldKey]: imageId, // Make sure the key matches your ACF field key
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to update ACF field", errorData);
    // Handle error accordingly
  } else {
    console.log("ACF field updated successfully");
  }
}
