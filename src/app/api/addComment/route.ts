// app/api/addComment/route.ts

interface CommentInput {
  postId: string;
  content: string;
  token: string;
}

interface CommentAuthor {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  content: string;
  author: {
    node: CommentAuthor;
  };
}

interface CreateCommentData {
  createComment: {
    comment: Comment | null;
  };
}

interface GraphQLResponse {
  data: CreateCommentData;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: any;
  }>;
}


async function submitComment({ postId, content, token }: CommentInput): Promise<GraphQLResponse> {
  const query = `
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
        commentOn: postId, // this id is in base64 format
        content,
      },
    };

  const response = await fetch('https://sardinie.web-devtesting.xyz/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const responseData: GraphQLResponse = await response.json();
  return responseData;
}

  export { submitComment };