type User = {
  id: string;
  name: string;
  posts: Post[];
}

type Post = {
  id: string;
  text: string;
  user: User;
}

type Select<T> = {
  [Property in keyof T]?: T[Property] extends Array<infer Item> ? Select<Item> :
    T[Property] extends Record<string, any> ? Select<T[Property]> : boolean;
}

const select: Select<Post> = {
  id: true,
  text: true,
  user: {
    id: true,
    posts: {
      id: true,
      text: true,
      user: {
        id: true,
        posts: {
          id: true
        }
      }
    }
  }
}

