// src/app/api/register/route.ts

export async function POST(request: {
  json: () =>
    | PromiseLike<{ username: any; email: any; password: any; name: any }>
    | { username: any; email: any; password: any; name: any };
}) {
  const { username, email, password, name } = await request.json();

  // Define the GraphQL mutation for registering a new user
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
      }
    `;

  try {
    // Execute the mutation using the WPGraphQL endpoint
    const graphqlResponse = await fetch(
      "https://sardinie.web-devtesting.xyz/index.php?graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: REGISTER_USER_MUTATION,
          variables: {
            username,
            email,
            password,
            name,
          },
        }),
      }
    );

    // Parse the response from the WPGraphQL server
    const { data, errors } = await graphqlResponse.json();

    // If there are errors, return a 400 Bad Request with the errors
    if (errors) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // On success, return the user data
    return new Response(JSON.stringify(data.registerUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle fetch or server errors
    return new Response(
      JSON.stringify({ message: "Registration error", error: error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
