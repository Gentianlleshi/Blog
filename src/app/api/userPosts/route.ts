// app/api/userPosts/route.ts
import useAuthStore from "@/app/stores/useAuthStore";
import { use } from "react";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.split(" ")[1];
  const { id: userId } = useAuthStore.getState();
  console.log("userId", userId, "authToken", authToken);
  // const { authToken } = useAuthStore((state) => ({
  //   authToken: state.authToken,
  // }));
  // const { authToken } = useAuthStore.getState();

  // Ensure the userId obtained is correct and not null
  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID is missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const USER_POSTS_QUERY = `
    query GetUserPosts($userId: ID!) {
      posts(where: { author: $userId }) {
        nodes {
          id
          title
          date
          content
        }
      }
    }
  `;

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
