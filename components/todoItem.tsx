import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Todo } from '../types/Todo';
import { CheckBox } from '@rneui/themed';
import { changeTodoTitle } from '../api/todos';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => void;
  activeTodoIds: number[];
  onStatusChange: (todo: Todo) => void;
  onTodoEdit: (editedTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onStatusChange,
  onTodoDelete,
  activeTodoIds,
  onTodoEdit,
}) =>
  {
    const [isTodoSaving, setIsTodoSaving] = useState(false);
    const [title, setTitle] = useState(todo.title);

    const handleRemoveTodo = () => {
      setIsTodoSaving(true);
      onTodoDelete(todo.id);
      setIsTodoSaving(false);
    };

    const handleStatusChange = (toggledTodo: Todo) => {
      setIsTodoSaving(true);
      onStatusChange(toggledTodo);
      setIsTodoSaving(false);
    };

    const handleFormSubmit = async () => {
      if (title.trim() === todo.title) {
        return;
      }

      if (title.trim().length === 0) {
        onTodoDelete(todo.id);

        return;
      }

      setIsTodoSaving(true);

      try {
        const editedTodo = await changeTodoTitle(todo.id, title);

        onTodoEdit(editedTodo);
      } catch {
        console.error('Unable to update a todo');
      }

      setIsTodoSaving(false);
    };

    const isModalActive =
      todo.id === 0 || activeTodoIds?.includes(todo.id) || isTodoSaving;

    return (
      <View style={styles.item}>
        {isModalActive && (
          <View style={styles.loader}>
            <ActivityIndicator color='#FF7F50' size='large' />
          </View>
        )}
        <View style={styles.container}>
          <CheckBox
            checked={todo.completed}
            size={18}
            onPress={() => handleStatusChange(todo)}
          />
          <TextInput
            style={todo.completed ? styles.itemTextCompleted : styles.itemText}
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={handleFormSubmit}
            onBlur={handleFormSubmit}
          />
        </View>

        <TouchableOpacity onPress={handleRemoveTodo}>
          <View style={styles.delete}>
            <MaterialIcons name='delete' size={16} color='#333' />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  item: {
    padding: 8,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    marginLeft: 10,
    paddingRight: 20,
  },
  itemTextCompleted: {
    marginLeft: 10,
    paddingRight: 20,
    textDecorationLine: 'line-through',
    color: '#ccc',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delete: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  loader: {
    position: 'absolute',
    width: '100%',
  },
});
