import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { fetchPosts, fetchTags } from "../redux/slices/posts";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const Home = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.auth);
    const { posts, tags } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, [dispatch]);

    const isPostLoading = posts.status === "loading";
    const isTagsLoading = tags.status === "loading";

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={0}
                aria-label="basic tabs example"
            >
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostLoading ? [...Array(5)] : posts.items).map(
                        (obj, index) =>
                            isPostLoading ? (
                                <Post key={index} isLoading={true} />
                            ) : (
                                <Post
                                    key={obj._id}
                                    id={obj._id}
                                    title={obj.title}
                                    imageUrl={
                                        obj.imageUrl
                                            ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                                            : ""
                                    }
                                    user={obj.user}
                                    createdAt={obj.createdAt}
                                    viewsCount={obj.veiwsCount}
                                    commentsCount={3}
                                    tags={["react", "fun", "typescript"]}
                                    isEditable={data?._id === obj.user._id}
                                />
                            )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: "Вася Пупкин",
                                    avatarUrl:
                                        "https://mui.com/static/images/avatar/1.jpg",
                                },
                                text: "Это тестовый комментарий",
                            },
                            {
                                user: {
                                    fullName: "Иван Иванов",
                                    avatarUrl:
                                        "https://mui.com/static/images/avatar/2.jpg",
                                },
                                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
