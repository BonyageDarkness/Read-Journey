import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import styles from "./Header.module.scss";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/signin");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/recommended" className={styles.logo}>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-Frame-8" />
          </svg>
          <span className={styles.logoText}>READ JOURNEY</span>
        </Link>
      </div>

      <nav
        className={styles.navContainer + (menuOpen ? " " + styles.open : "")}
      >
        <div className={styles.closeIcon} onClick={toggleMenu}>
          <svg className={styles.closeIconSvg}>
            <use href="/sprite.svg#icon-x" />
          </svg>
        </div>

        <ul className={styles.navList}>
          <li>
            <Link
              to="/recommended"
              className={
                location.pathname === "/recommended"
                  ? styles.active
                  : styles.inactive
              }
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            {location.pathname === "/recommended" && (
              <svg className={styles.underline} width="43px" height="4px">
                <use href="/sprite.svg#icon-Vector-6" />
              </svg>
            )}
          </li>
          <li>
            <Link
              to="/library"
              className={
                location.pathname === "/library"
                  ? styles.active
                  : styles.inactive
              }
              onClick={() => setMenuOpen(false)}
            >
              My library
            </Link>
            {location.pathname === "/library" && (
              <svg className={styles.underline} width="68px" height="4px">
                <use href="/sprite.svg#icon-Vector-7" />
              </svg>
            )}
          </li>
        </ul>

        <div className={styles.rigth}>
          {isLoggedIn && user?.name && (
            <div className={styles.userAvatar1}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {isLoggedIn && (
            <button className={styles.logoutButton} onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </nav>

      <div className={styles.menuContainer}>
        {isLoggedIn && user?.name && (
          <div className={styles.userAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          className={`${styles.menuIcon} ${styles.mobileOnly}`}
          onClick={toggleMenu}
        >
          <svg className={styles.menuLogo}>
            <use href="/sprite.svg#icon-menu-04" />
          </svg>
        </div>
      </div>
    </header>
  );
}
