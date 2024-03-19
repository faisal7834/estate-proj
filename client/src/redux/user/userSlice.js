import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailed: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },
        updateStart: (state) => {
            state.loading = true
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        updateFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state)=>{
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.loading = action.payload
            state.loading = false
        },
        signOutStart: (state)=>{
            state.loading = true
        },
        signOutSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        signOutFailure: (state, action) => {
            state.loading = action.payload
            state.loading = false
        }
    }
});

export const {signInStart, signInSuccess, signInFailed, updateFailure, updateStart, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutFailure, signOutStart, signOutSuccess} = userSlice.actions;
export default userSlice.reducer