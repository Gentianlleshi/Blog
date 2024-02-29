interface AuthorNode {
  id: string;
  name: string;
}

interface CommentNode {
  id: string;
  content: string; // Assuming content is an HTML string
  author: {
    node: AuthorNode;
  };
}

interface CommentEdge {
  node: CommentNode;
}

interface PostComments {
  edges: CommentEdge[];
}

interface CategoryNode {
  id: string;
  slug: string;
  name: string;
}

export interface PostNode {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    node: AuthorNode;
  };
  categories: {
    edges: Array<{ node: CategoryNode }>;
  };
  comments: PostComments;
}

export interface SinglePostProps {
  post: PostNode;
}
