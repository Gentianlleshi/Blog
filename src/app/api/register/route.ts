// src/app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  const REGISTER_USER_MUTATION = `      
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(input: {
      clientMutationId: "uniqueId",
      username: $username,
      email: $email,
      password: $password
    }) {
      user {
        userId
        username
        name
        email
      }
    }
  }`; // Your GraphQL mutation

  try {
    const graphqlResponse = await fetch("https://sardinie.web-devtesting.xyz/index.php?graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REGISTER_USER_MUTATION,
        variables: { username, email, password },
      }),
    });

    const { data, errors } = await graphqlResponse.json();

    if (errors) {
      return new NextResponse(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(data.registerUser), {
      status: 201, // Use 201 to indicate a resource was successfully created
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Registration error", error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}