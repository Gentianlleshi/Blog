// auth types for the auth slice in Redux 

export interface AuthorNode {
  id: string;
  name: string;
}

export interface CategoryNode {
  id: string;
  slug: string;
  name: string;
}

export interface PostNode {
  comments: string | TrustedHTML;
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
}


