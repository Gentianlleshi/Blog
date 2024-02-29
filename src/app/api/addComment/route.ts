import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { postId, content, token } = req.body;

  // Ensure all required fields are provided
  if (!postId || !content || !token) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const CREATE_COMMENT_MUTATION = `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        comment {
          id
          content
          author {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      commentOn: parseInt(postId, 10),
      content,
    },
  };

  try {
    const graphqlResponse = await fetch(
      "https://sardinie.web-devtesting.xyz/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: CREATE_COMMENT_MUTATION, variables }),
      }
    );

    if (!graphqlResponse.ok) {
      // Handle HTTP errors
      const errorText = await graphqlResponse.text();
      return res
        .status(graphqlResponse.status)
        .json({ error: "Failed to create comment", details: errorText });
    }

    const graphqlData = await graphqlResponse.json();
    if (graphqlData.errors) {
      // Handle GraphQL errors
      return res
        .status(400)
        .json({ error: "GraphQL error", details: graphqlData.errors });
    }

    // Success
    return res.status(200).json({
      message: "Comment created successfully",
      data: graphqlData.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
