import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TodoItem } from './todoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onStatusChange: (todo: Todo) => void;
  onTodoDelete: (todoId: number) => void;
  activeTodoIds: number[];
  onTodoEdit: (editedTodo: Todo) => void;
  onClearCompleted: () => void;
  onToggleAll: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onStatusChange,
  onTodoDelete,
  activeTodoIds,
  onTodoEdit,
  onClearCompleted,
  onToggleAll,
}) => {
  const clearIsVisible = todos.some((todo) => todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <ScrollView style={styles.list} keyboardShouldPersistTaps='handled'> 
      <View style={styles.listHead}>
      <TouchableOpacity 
        style={styles.listItem}
        onPress={onToggleAll}
      >
        <MaterialIcons 
          name={isAllCompleted ? 'close' : 'done'} 
          size={16} 
          color='#333' 
        />
        <Text>
          {isAllCompleted ? 'Uncomplete all' : 'Complete all'}
        </Text>
      </TouchableOpacity>

      {clearIsVisible && (
        <TouchableOpacity style={styles.listItem} onPress={onClearCompleted}>
          <Text>
            Clear Completed
          </Text>
          <MaterialIcons name='delete' size={16} color='#333' />
        </TouchableOpacity>
      )}
      </View>
      
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusChange={onStatusChange}
          onTodoDelete={onTodoDelete}
          activeTodoIds={activeTodoIds}
          onTodoEdit={onTodoEdit}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
