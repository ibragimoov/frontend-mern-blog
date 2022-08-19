import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";

import axios from "../../axios";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

import { selectIsAuth } from "../../redux/slices/auth";
import { useRef } from "react";

export const AddPost = () => {
    const { id } = useParams();
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [isLoading, setIsLoading] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const inputFileRef = useRef(null);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("/upload", formData);
            setImageUrl(data.url);
        } catch (error) {
            console.log(error);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl("");
    };

    const onChange = React.useCallback((value) => {
        setValue(value);
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const tagsArray = tags.split(",");

            const fields = {
                title,
                text: value,
                imageUrl,
                tags: tagsArray,
            };

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post("/posts", fields);

            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`);
        } catch (error) {
            console.log(error);
            alert("Ошибка при создании статьи");
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
            placeholder: "Введите текст...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    React.useEffect(() => {
        axios.get(`/posts/${id}`).then(({ data }) => {
            setTitle(data.title);
            setValue(data.text);
            setImageUrl(data.imageUrl);
            setTags(data.tags);
        });
    }, []);

    if (!window.localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
            >
                Загрузить превью
            </Button>
            <input
                ref={inputFileRef}
                type="file"
                onChange={handleChangeFile}
                hidden
            />
            {imageUrl && (
                <>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClickRemoveImage}
                    >
                        Удалить
                    </Button>
                    <img
                        className={styles.image}
                        src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                        alt="Uploaded"
                    />
                </>
            )}
            <br />
            <br />
            <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={value}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? "Сохранить" : "Опубликовать"}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
