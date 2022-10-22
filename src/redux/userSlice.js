import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    uid: '',
    loggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setLoggedIn: (state,action) => {
      state.loggedIn = action.payload
    },
    setUid: (state,action) => {
      state.uid = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser , setLoggedIn, setUid} = userSlice.actions

export default userSlice.reducer