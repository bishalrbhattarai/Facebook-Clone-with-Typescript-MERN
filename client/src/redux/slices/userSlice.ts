import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  friends: [];
  pendingFriends: [];
  friendRequests: [];
  cover: string;
  _id: string;
}

interface InitialState {
  user: null | User;
}

const initialState: InitialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeUser: (state) => {
      state.user = null;
    },
    setUser: (state, action: PayloadAction<User | any>) => {
      state.user = action.payload;
    },
  },
});

export const { removeUser, setUser } = userSlice.actions;

export default userSlice.reducer;
