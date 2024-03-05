// app/api/allPosts/route.ts;


export async function GET() {
  const currentMinute = new Date().getMinutes();
  // Alternate between 999 and 998 based on whether the current minute is even or odd
  const postsCount = currentMinute % 2 === 0 ? 999 : 998;
  const query = `
  query NewQuery {
    posts(first: ${postsCount}) {
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
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
        next: {
          revalidate: 1,
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
      headers: { "Content-Type": "application/json","Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0", },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json","Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",Pragma: "no-cache",
      Expires: "0",},
    });
  }
}
