export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  WordList: undefined;
  Menu: undefined;
  WordDetail: {
    word: string;
    words: string[];
  };
};

export type RootStackParamList = AuthStackParamList & MainStackParamList;
