// src/app/api/login/route.ts

import { serialize } from "cookie";

export async function POST(request: {
  json: () =>
    | PromiseLike<{ username: string; password: string }>
    | { username: string; password: string };
}) {
  try {
    const { username, password } = await request.json();

    const LOGIN_MUTATION = `
      mutation LoginUser($username: String!, $password: String!) {
        login(input: {
          clientMutationId: "uniqueId",
          username: $username,
          password: $password
        }) {
          authToken
          user {
            id
            name
          }
        }
      }
    `;

    const graphqlResponse = await fetch(
      "https://sardinie.web-devtesting.xyz/index.php?graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: LOGIN_MUTATION,
          variables: { username, password },
        }),
      }
    );
    if (!graphqlResponse.ok) {
      throw new Error(graphqlResponse.statusText);
    }

    const { data, errors } = await graphqlResponse.json();

    if (errors || !data.login) {
      throw new Error(errors?.[0]?.message || "Login failed");
    }

    // Set auth token in HTTP-only cookie
    const headers = {
      "Set-Cookie": serialize("authToken", data.login.authToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      }),
      "Content-Type": "application/json",
    };

    // Optionally, redirect user or send success response
    return new Response(JSON.stringify({
      authToken: data.login.authToken, // Send authToken for client-side storage (if applicable)
      username: data.login.user.name, // Include username or other user details in response
    }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
