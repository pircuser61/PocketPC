import React, {useEffect, useRef, useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import SimpleButton from './SimpleButton';

const LoginDlg = ({
  title,
  onSubmit,
  onCancel,
  initLogin = '',
  active = true,
}: {
  title?: string;
  onSubmit: (uid: string, passwd: string) => void;
  onCancel: () => void;
  initLogin?: string;
  active?: boolean;
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const refLogin = useRef<TextInput>(null);
  const refPassword = useRef<TextInput>(null);
  /* для тестов*/
  useEffect(() => {
    setLogin(initLogin);
    setPassword('');
  }, []);

  /* При автофокусе клавиатура непоказывается, приходится делать так */
  useEffect(() => {
    const timeout = setTimeout(() => {
      refLogin.current?.blur();
      refLogin.current?.focus();
    }, 40);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Modal transparent={true}>
      <View style={styles.shadowView}>
        <View style={styles.background}>
          {title ? <Text style={styles.labelText}>{title}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Табельный номер"
            value={login}
            ref={refLogin}
            onChangeText={setLogin}
            onSubmitEditing={() => refPassword.current?.focus()}
            editable={active}
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry={true}
            value={password}
            ref={refPassword}
            onChangeText={setPassword}
            onSubmitEditing={() => onSubmit(login, password)}
            editable={active}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <SimpleButton
              text="Ок"
              containerStyle={styles.buttonStyle}
              onPress={() => onSubmit(login, password)}
              active={active}
            />
            <SimpleButton
              text="Отмена"
              containerStyle={styles.buttonStyle}
              onPress={onCancel}
              active={active}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginDlg;

const styles = StyleSheet.create({
  buttonStyle: {width: 120, alignItems: 'center'},

  background: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    width: 360,
    position: 'absolute',
    top: 90,
  },
  labelText: {
    paddingTop: 10,
    fontSize: 18,
  },
  input: {
    paddingBottom: 10,
    paddingLeft: 16,
    fontSize: 18,

    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    height: 48,
    marginVertical: 8,
  },

  shadowView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
