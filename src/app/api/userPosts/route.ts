// app/api/userPosts/route.ts
// import useAuthStore from "@/app/stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.split(" ")[1] || "";
  // const { id: userId } = useAuthStore.getState();
  // const userId = 12;
  let userId;
  try {
    const decodedToken = jwtDecode<{ data: { user: { id: string } } }>(
      authToken
    );
    console.log(decodedToken);
    userId = parseInt(decodedToken.data.user.id, 10);
  } catch (error) {
    console.error("Error decoding token:", error);
    // Handle error (e.g., return an appropriate response to the client)
  }

  if (!authToken) {
    return new Response(JSON.stringify({ message: "Auth token is missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const USER_POSTS_QUERY = `
    query GetUserPosts($userId: Int!) {
      posts(where: { author: $userId }) {
        nodes {
        id
        title
        content
        }
      }
    }
    `;

  // You'll need to modify this to get the user ID from the token or context
  const variables = { userId };

  const graphqlResponse = await fetch(
    "https://sardinie.web-devtesting.xyz/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ query: USER_POSTS_QUERY, variables }),
    }
  );

  if (!graphqlResponse.ok) {
    const errorText = await graphqlResponse.text();
    return new Response(
      JSON.stringify({
        message: "Failed to fetch user posts",
        error: errorText,
      }),
      {
        status: graphqlResponse.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const graphqlData = await graphqlResponse.json();

  return new Response(JSON.stringify(graphqlData.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
