import React from "react";
import { useSignUpPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { LoginWithFacebook } from "./login";
import { AuthContext } from "../auth";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { HighlightOff, CheckCircleOutline } from "@material-ui/icons";
import { useApolloClient } from "@apollo/react-hooks";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { register, handleSubmit, formState, errors } = useForm({
    mode: "onBlur",
  });
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = React.useState("");
  const client = useApolloClient();

  async function onSubmit(data) {
    setError("");
    try {
      await signUpWithEmailAndPassword(data);
      setTimeout(() => history.push("/"), 0);
    } catch (error) {
      console.error("Error signing up", error);
      // setError(error.message);
      handleError(error);
    }
  }

  async function validateUsername(username) {
    const variables = { username };
    const response = await client.query({
      query: CHECK_IF_USERNAME_TAKEN,
      variables,
    });
    const isUsernameValid = response.data.users.length === 0;
    return isUsernameValid;
  }

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError("Username already taken");
    } else if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  const errorIcon = (
    <InputAdornment>
      <HighlightOff
        style={{
          color: "red",
          height: 30,
          width: 30,
        }}
      />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline
        style={{
          color: "#ccc",
          height: 30,
          width: 30,
        }}
      />
    </InputAdornment>
  );

  return (
    <>
      <SEO title="Sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sing up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography varinat="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                InputProps={{
                  endAdornment: errors.email
                    ? errorIcon
                    : formState.touched.email && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
                name="email"
                inputRef={register({
                  required: true,
                  validate: (input) => isEmail(input),
                })}
              />
              <TextField
                InputProps={{
                  endAdornment: errors.name
                    ? errorIcon
                    : formState.touched.name && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
                name="name"
                inputRef={register({
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
              />
              <TextField
                InputProps={{
                  endAdornment: errors.username
                    ? errorIcon
                    : formState.touched.username && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                name="username"
                inputRef={register({
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.]*$/,
                  validate: async (input) => await validateUsername(input),
                })}
              />
              <TextField
                InputProps={{
                  endAdornment: errors.password
                    ? errorIcon
                    : formState.touched.password && validIcon,
                }}
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                type="password"
                className={classes.textField}
                autoComplete="new-password"
                name="password"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                className={classes.button}
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>
              <Button color="secondary" fullWidth>
                <Typography variant="caption">Forgot password?</Typography>
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function AuthError({ error }) {
  return (
    Boolean(error) && (
      <Typography
        gutterBottom
        variant="body2"
        align="center"
        style={{ color: "red" }}
      >
        {error}
      </Typography>
    )
  );
}

export default SignUpPage;
