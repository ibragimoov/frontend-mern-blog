import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const { data } = await axios.get("/posts");
    return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
    const { data } = await axios.get("/tags");
    return data;
});

export const fetchRemovePost = createAsyncThunk(
    "posts/fetchRemovePost",
    async (id) => {
        axios.delete(`/posts/${id}`);
    }
);

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
    tags: {
        items: [],
        status: "loading",
    },
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: {
        // fetch posts
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = "loading";
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = "loaded";
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.status = "error";
            state.posts.items = [];
        },
        // fetch tags
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = "loading";
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = "loaded";
        },
        [fetchTags.rejected]: (state) => {
            state.tags.status = "error";
            state.tags.items = [];
        },
        // delete posts
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter((obj) => {
                return obj._id !== action.payload;
            });
            state.tags.status = "loading";
        },
        [fetchRemovePost.fulfilled]: (state, action) => {
            state.posts.items = state.posts.items.filter((obj) => {
                return obj._id !== action.meta.arg;
            });
            state.tags.status = "loaded";
        },
    },
});

export const postReducer = postSlice.reducer;
