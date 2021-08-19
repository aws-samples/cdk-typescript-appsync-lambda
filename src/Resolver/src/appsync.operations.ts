import { Todo, todos } from "./interfaces";
import { v4 as uuidv4 } from "uuid";

const getTodo = ({ id }: { id: string }): Todo | undefined =>
  todos.find((todo) => todo.id === id);

const listTodos = ({ limit }: { limit: number }): { items: Array<Todo> } => ({
  items: todos.slice(0, limit),
});

type CreateTodoArgs = { id?: string; name: string; description?: string };

const createTodo = ({ id, name, description }: CreateTodoArgs): Todo => {
  const createdAt = new Date();

  const todo: Todo = {
    id: id ?? uuidv4(),
    name,
    description,
    createdAt,
    updatedAt: createdAt,
  };

  todos.push(todo);

  return todo;
};

type UpdateTodoArgs = { id: string; name?: string; description?: string };

const updateTodo = ({
  id,
  name,
  description,
}: UpdateTodoArgs): Todo | undefined => {
  const index = todos.findIndex((todo) => todo.id === id);

  if (index < 0) {
    return undefined;
  }

  const todo = todos[index];

  if (name) {
    todo.name = name;
  }

  if (description) {
    todo.description = description;
  }

  todo.updatedAt = new Date();
  todos[index] = todo;

  return todo;
};

const deleteTodo = ({ id }: { id: string }): Todo | undefined => {
  const index = todos.findIndex((todo) => todo.id === id);

  if (index < 0) {
    return undefined;
  }

  return todos.splice(index, 1)[0];
};

export const operations: { [key: string]: { [key: string]: any } } = {
  Query: { getTodo, listTodos },
  Mutation: { createTodo, updateTodo, deleteTodo },
};
