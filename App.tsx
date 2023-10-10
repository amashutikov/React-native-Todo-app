import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AddTodo } from './components/addTodo';
import { Todo } from './types/Todo';
import {
  addTodo,
  getTodos,
  removeCompleted,
  removeTodo,
  toggleAll,
  toggleTodo,
} from './api/todos';
import { Header } from './components/header';
import { filterTodos } from './helpers/filterTodos';
import { TodoFilter } from './types/Filters';
import { TodoList } from './components/todoList';

const USER_ID = 10858;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaderIsVisible, setLoaderIsVisible] = useState(true);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((result) => {
        setTodos(result);
        setTimeout(() => setLoaderIsVisible(false), 200);
      })
      .catch(() => console.error('Unable to load todos'));
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const activeTodosCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  const isAllTodosCompleted = useMemo(
    () => todos.every((todo) => todo.completed),
    [todos],
  );

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  const handleTodoAdd = useCallback((title: string) => {
    setLoaderIsVisible(true);

    addTodo(title)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setLoaderIsVisible(false);

        return newTodo;
      })
      .catch(() => {
        console.error('Unable to add a todo');
        setLoaderIsVisible(false);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setActiveTodoIds((prev) => [...prev, todoId]);

    removeTodo(todoId)
      .then((response) => {
        const isDeleted = Boolean(response);

        if (isDeleted) {
          setTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== todoId),
          );

          setActiveTodoIds([]);
        }

        return isDeleted;
      })
      .catch(() => {
        console.error('Unable to delete a todo');
        setActiveTodoIds([]);
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setActiveTodoIds((prev) => [...prev, ...completedTodoIds]);

    removeCompleted(completedTodoIds)
      .then((response) => {
        const isDeleted = Boolean(response);

        if (isDeleted) {
          setTodos((prevTodos) =>
            prevTodos.filter((todo) => !completedTodoIds.includes(todo.id)),
          );

          setActiveTodoIds([]);
        }

        return isDeleted;
      })
      .catch(() => {
        console.error('Unable to delete todos');
        setActiveTodoIds([]);
      });
  }, [todos]);

  const toggleCompletedStatus = useCallback(
    async (toggledTodo: Todo) => {
      setActiveTodoIds((prev) => [...prev, toggledTodo.id]);

      try {
        const updatedTodo = await toggleTodo(toggledTodo);

        setTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (todo.id === toggledTodo.id) {
              return updatedTodo;
            }

            return todo;
          }),
        );

        setActiveTodoIds([]);
      } catch {
        console.error('Unable to update a todo');
        setActiveTodoIds([]);
      }
    },
    [todos],
  );

  const handleToggleAllStatuses = useCallback(() => {
    const todoIds = todos.map((todo) => todo.id);

    if (isAllTodosCompleted) {
      setActiveTodoIds((prev) => [...prev, ...todoIds]);

      toggleAll(todos)
        .then((response) => {
          setTodos(response);
          setActiveTodoIds([]);
        })
        .catch(() => {
          console.error('Unable to toggle todos');
          setActiveTodoIds([]);
        });

      return;
    }

    const uncompletedTodos = todos.filter((todo) => !todo.completed);

    setActiveTodoIds((prev) => [...prev, ...todoIds]);

    toggleAll(uncompletedTodos)
      .then((response) => {
        const toggledIds = response.map((todo) => todo.id);

        setTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (toggledIds.includes(todo.id)) {
              return { ...todo, completed: true };
            }

            return todo;
          }),
        );
        setActiveTodoIds([]);
      })
      .catch(() => {
        console.error('Unable to toggle todos');
        setActiveTodoIds([]);
      });
  }, [todos]);

  const handleTodoEdit = useCallback((editedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === editedTodo.id) {
          return editedTodo;
        }

        return todo;
      }),
    );
  }, []);

  return (
    <View style={styles.container}>
      {loaderIsVisible && (
        <View style={styles.loader}>
          <ActivityIndicator color='#FF7F50' size='large' />
        </View>
      )}

      <Header
        onFilterChange={handleFilterChange}
        isAllTodosComplete={isAllTodosCompleted}
        activeTodosCount={activeTodosCount}
      />
      <View style={styles.content}>
        <AddTodo onTodoAdd={handleTodoAdd} />

        <TodoList
          todos={visibleTodos}
          onStatusChange={toggleCompletedStatus}
          onTodoDelete={deleteTodo}
          activeTodoIds={activeTodoIds}
          onTodoEdit={handleTodoEdit}
          onClearCompleted={handleClearCompleted}
          onToggleAll={handleToggleAllStatuses}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 40,
    flex: 1,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 80, 80, 0.2)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
});
