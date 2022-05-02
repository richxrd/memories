import React, { useState } from "react";
import {
    Container,
    Grow,
    Grid,
    Paper,
    AppBar,
    TextField,
    Button,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { getPostBySearch } from "../../actions/posts";
import Form from "../Form/Form";
import Posts from "../Posts/Posts";
import Paginations from "../Paginations";
import useStyles from "./styles";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([]);

    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get("page") || 1;
    const searchQuery = query.get("searchQuery");

    const classes = useStyles();

    const searchPost = () => {
        if (search.trim() || tags.length > 0) {
            dispatch(getPostBySearch({ search, tags: tags.join(",") }));
            navigate(
                `/posts/search?searchQuery=${search || "none"}&tags=${
                    tags.join(",") || "none"
                }`
            );
        } else {
            navigate("/");
        }
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    };

    const handleAdd = (tag) => {
        setTags([...tags, tag]);
    };
    const handleDelete = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={3}
                    className={classes.gridContainer}
                >
                    <Grid item sx={12} sm={6} md={8}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item sx={12} sm={6} md={4}>
                        <AppBar
                            className={classes.appBarSearch}
                            position="static"
                            color="inherit"
                        >
                            <TextField
                                name="search"
                                variant="outlined"
                                label="Search Memories"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <ChipInput
                                style={{ margin: "10px 0" }}
                                value={tags}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                label="Search Tags"
                                variant="outlined"
                            />
                            <Button
                                onClick={searchPost}
                                className={classes.searchButton}
                                color="primary"
                                variant="contained"
                            >
                                Search
                            </Button>
                        </AppBar>
                        <Form
                            currentId={currentId}
                            setCurrentId={setCurrentId}
                        />
                        {!searchQuery && !tags.length && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Paginations page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
};

export default Home;
