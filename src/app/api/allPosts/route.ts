// app/api/allPosts/route.ts;
export async function GET() {
  const query = `
  query NewQuery {
    posts {
      edges {
        node {
          id
          title
          slug
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
  }
  `;
  try {
    const response = await fetch(
      "https://sardinie.web-devtesting.xyz/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },

        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { data } = await response.json();
    return new Response(JSON.stringify(data.posts.edges), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
