import React, { useState } from "react";
import {
    Avatar,
    Paper,
    Grid,
    Typography,
    Container,
    Button,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import useStyles from "./styles";
import Input from "./Input";
import Icon from "./icon";
import { signin, signup } from "../../actions/auth";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const Auth = () => {
    const [showPassord, setShowPassord] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassord(!showPassord);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp) {
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
        setShowPassord(false);
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: "AUTH", data: { result, token } });

            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };
    const googleFailure = () => {
        console.log("Google Sign in was unsuccessful");
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>

                <Typography variant="h5">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Typography>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignUp && (
                            <>
                                <Input
                                    name="firstName"
                                    label="First Name"
                                    handleChange={handleChange}
                                    autoFocus
                                    half
                                />

                                <Input
                                    name="lastName"
                                    label="Last Name"
                                    handleChange={handleChange}
                                    half
                                />
                            </>
                        )}

                        <Input
                            name="email"
                            label="Email Address"
                            handleChange={handleChange}
                            type="email"
                        />
                        <Input
                            name="password"
                            label="Password"
                            handleChange={handleChange}
                            type={showPassord ? "text" : "password"}
                            handleShowPassword={handleShowPassword}
                        />
                        {isSignUp && (
                            <Input
                                name="confirmPassword"
                                label="Confirm Password"
                                handleChange={handleChange}
                                type="password"
                            />
                        )}
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>

                    <GoogleLogin
                        clientId="878429723573-ilbeo51e3q9loiga5ik5t833ntrvsuil.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button
                                className={classes.googleButton}
                                color="primary"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />}
                                variant="contained"
                            >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignUp
                                    ? "Already have an account? Sign In"
                                    : "Create an account"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Auth;
