import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuthData = createAsyncThunk(
    "/auth/fetchUserData",
    async (params) => {
        const { data } = await axios.post("/auth/login", params);
        return data;
    }
);

export const fetchAuthMe = createAsyncThunk("/auth/fetchAuthMe", async () => {
    const { data } = await axios.post("/auth/me");
    return data;
});

const initialState = {
    data: null,
    status: "loading",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: {
        [fetchAuthData.pending]: (state) => {
            state.data = null;
            state.status = "loading";
        },
        [fetchAuthData.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "loaded";
        },
        [fetchAuthData.rejected]: (state) => {
            state.data = null;
            state.status = "error";
        },
        [fetchAuthMe.pending]: (state) => {
            state.data = null;
            state.status = "loading";
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "loaded";
        },
        [fetchAuthMe.rejected]: (state) => {
            state.data = null;
            state.status = "error";
        },
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
