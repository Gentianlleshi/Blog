// src/app/api/newPost/route.ts

export async function POST(request: Request) {
  // Extracting JSON body from the request
  const { title, content } = await request.json();

  console.log("Title:", title);
  console.log("Content:", content);

  // Extracting authToken from the Authorization header
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.split(" ")[1]; // Assumes format "Bearer <token>"

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
      title: title, // Use the title variable
      content: content, // Use the content variable
      status: "PUBLISH", // Optionally set the status
    },
  };

  // Ensure authToken is provided
  if (!authToken) {
    return new Response(JSON.stringify({ message: "Auth token is missing" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Replace 'https://yourwordpresssite.com/graphql' with your actual WordPress GraphQL endpoint
  const response = await fetch("https://sardinie.web-devtesting.xyz/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // The Authorization header here would be specific to how your WordPress site handles authentication
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query: CREATE_POST_MUTATION,
      variables,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        message: "Failed to create post",
        errors: responseData.errors,
      }),
      {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Post created successfully",
      data: responseData.data,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
