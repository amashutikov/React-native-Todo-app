import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

type Props = {
  onTodoAdd: (title: string) => void;
};

export const AddTodo: React.FC<Props> = ({ onTodoAdd, }  
) => {
  const [newTitle, setNewTitle] = useState('');

  const handleTitleChange = (value: string) => {
    setNewTitle(value);
  };

  const handleFormSubmit = () => {
    if (!newTitle.trim()) {
      console.error("Title can't be empty");

      return;
    }

    onTodoAdd(newTitle.trim());

    setNewTitle('');
  };

  return (
    <View>
      <TextInput 
        style={styles.input} 
        placeholder='What needs to be done?'
        onChangeText={handleTitleChange} 
        value={newTitle} 
      />
      <Button color='coral' onPress={handleFormSubmit} title='add todo' />

      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  underline: {
    borderWidth: 1,
    marginTop: 20,
    borderColor: '#ddd',
  },
});