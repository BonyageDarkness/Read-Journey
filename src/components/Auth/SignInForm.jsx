import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import styles from "./SignForm.module.scss";
import iphone1x from "../../img/main/iPhone15Black1.jpg";
import iphone2x from "../../img/main/iPhone15Black1@2x.jpg";
import iphoneDesktop1x from "../../img/main/iPhone15Black.png";
import iphoneDesktop2x from "../../img/main/iPhone15Black@2x.png";
import { loginUser } from "../../redux/auth/authOperations";
import {
  selectIsLoading,
  selectAuthError,
} from "../../redux/auth/authSelectors";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(7, "Enter a valid Password*")
    .required("Password is secure"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Login successful!");
      navigate("/recommended");
    } catch (error) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className={styles.signContainer}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.logoContainer}>
          <Link to="/signin" className={styles.logo}>
            <div className={styles.logoContainer}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#icon-Frame-8" />
              </svg>
              <span className={styles.logoText}>READ JOURNEY</span>
            </div>
          </Link>
        </div>

        <h2 className={styles.title}>
          Expand your mind, reading{" "}
          <span className={styles.highlight}>a book</span>
        </h2>
        <div className={styles.labelContainer}>
          <div className={styles.wrapperLabel}>
            <label className={styles.label} htmlFor="email">
              Mail:
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`${styles.inputEmail} ${
                  errors.email
                    ? styles.inputError
                    : watch("email")
                    ? styles.inputSuccess
                    : ""
                }`}
              />

              {errors.email && (
                <svg className={styles.inputIconError}>
                  <use href="/sprite.svg#icon-pajamas_error" />
                </svg>
              )}

              {!errors.email && watch("email") && (
                <svg className={styles.inputIconSuccess}>
                  <use href="/sprite.svg#icon-gg_check-o" />
                </svg>
              )}
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.wrapperLabel}>
            <label className={styles.label} htmlFor="password">
              Password:
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`${styles.inputPassword} ${
                  errors.password
                    ? styles.inputError
                    : watch("password")?.length >= 7
                    ? styles.inputSuccess
                    : ""
                }`}
              />

              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <svg className={styles.eyeIcon}>
                  <use
                    href={`/sprite.svg#${
                      showPassword ? "icon-eye-off" : "icon-eye"
                    }`}
                  />
                </svg>
              </span>
            </div>

            {errors.password ? (
              <p className={styles.error}>{errors.password.message}</p>
            ) : (
              watch("password")?.length >= 7 && (
                <p className={styles.successMessage}>Password is secure</p>
              )
            )}
          </div>
        </div>
        <div className={styles.containerButtonLogin}>
          <button
            type="submit"
            className={styles.buttonLogin}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Login"}
          </button>

          <p className={styles.switch}>
            <a href="/signup"> Don’t have an account?</a>
          </p>
        </div>
      </form>
      <div className={styles.containerForm}>
        <picture>
          <source
            media="(min-width: 1440px)"
            srcSet={`${iphoneDesktop1x} 1x, ${iphoneDesktop2x} 2x`}
            alt="iPhone 15 Black"
          />
          <img
            src={iphone1x}
            srcSet={`${iphone1x} 1x, ${iphone2x} 2x`}
            alt="iPhone 15 Black"
            className={styles.responsiveImage}
          />
        </picture>
      </div>
    </div>
  );
}
