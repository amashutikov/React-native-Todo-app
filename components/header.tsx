import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckBox, Dialog, Header as HeaderFC, Icon } from '@rneui/themed';
import { TodoFilter } from '../types/Filters';

type Props = {
  onFilterChange: (filte: TodoFilter) => void;
  isAllTodosComplete: boolean;
  activeTodosCount: number;
};

export const Header: React.FC<Props> = ({
  onFilterChange,
  isAllTodosComplete,
  activeTodosCount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checked, setChecked] = useState<TodoFilter>(TodoFilter.All);
  const [confirmed, setConfirmed] = useState<TodoFilter>(TodoFilter.All);

  return (
    <>
      <HeaderFC
        backgroundColor='coral'
        leftComponent={
          <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
            <Icon name='menu' color='#fff' />
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Todo', style: styles.heading }}
      />
      {isMenuOpen && (
        <View>
          <Dialog
            isVisible={isMenuOpen}
            onBackdropPress={() => setIsMenuOpen(false)}
          >
            <Dialog.Title title='Select todo filter' />
            {Object.entries(TodoFilter).map(([key, value]) => (
              <CheckBox
                key={value}
                title={key}
                containerStyle={styles.checkbox}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={checked === value}
                onPress={() => setChecked(value)}
              />
            ))}

            <Text
              style={[styles.text, isAllTodosComplete && styles.textHidden]}
            >
              {activeTodosCount} active items left
            </Text>

            <Dialog.Actions>
              <Dialog.Button
                title='CONFIRM'
                onPress={() => {
                  setConfirmed(checked);
                  onFilterChange(checked);
                  setIsMenuOpen(false);
                }}
              />
              <Dialog.Button
                title='CANCEL'
                onPress={() => {
                  setIsMenuOpen(false);
                  setChecked(confirmed);
                }}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkbox: {
    backgroundColor: 'white',
    borderWidth: 0,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
  },
  textHidden: {
    display: 'none',
  },
});
