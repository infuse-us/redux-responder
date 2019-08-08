const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function getTodos() {
  const response = await fetch(TODOS_URL);
  return response.json();
}

export async function postTodo(todo) {
  const response = await fetch(
    TODOS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(todo),
    },
  );
  return response.json();
}
