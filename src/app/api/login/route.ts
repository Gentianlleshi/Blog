// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
        userId
      }
    }
  }`; // Your GraphQL mutation

  try {
    const graphqlResponse = await fetch(
      "https://sardinie.web-devtesting.xyz/graphql",
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

    const { data, errors } = await graphqlResponse.json();

    if (errors || !data.login) {
      throw new Error(errors?.[0]?.message || "Login failed");
    }

    const headers = {
      "Content-Type": "application/json",
    };

    return new NextResponse(
      JSON.stringify({
        authToken: data.login.authToken,
        username: data.login.user.name,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: (error as Error).message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
