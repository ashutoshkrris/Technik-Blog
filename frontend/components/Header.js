import { useState } from "react";
import { APP_NAME } from "../config";
import Link from "next/link";
import Router from "next/router";
import { logout, isAuth } from "../actions/auth";
import NProgress from "nprogress";

import {
  Collapse,
  Navbar,
  Nav,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  NavLink,
} from "reactstrap";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink className="font-weight-bold" style={{ cursor: "pointer" }}>
            {APP_NAME}
          </NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <React.Fragment>
              <NavItem>
                <a href="/blogs" style={{ textDecoration: "none" }}>
                  <NavLink style={{ cursor: "pointer" }}>Blogs</NavLink>
                </a>
              </NavItem>
            </React.Fragment>
            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <a href="/signup" style={{ textDecoration: "none" }}>
                    <NavLink style={{ cursor: "pointer" }}>Sign Up</NavLink>
                  </a>
                </NavItem>
                <NavItem>
                  <a href="/login" style={{ textDecoration: "none" }}>
                    <NavLink style={{ cursor: "pointer" }}>Log In</NavLink>
                  </a>
                </NavItem>
              </React.Fragment>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <a href="/user" style={{ textDecoration: "none" }}>
                  <NavLink style={{ cursor: "pointer" }}>{`${
                    isAuth().name.split(" ")[0]
                  }'s Dashboard`}</NavLink>
                </a>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <a href="/admin" style={{ textDecoration: "none" }}>
                  <NavLink style={{ cursor: "pointer" }}>{`${
                    isAuth().name.split(" ")[0]
                  }'s Dashboard`}</NavLink>
                </a>
              </NavItem>
            )}
            {isAuth() && (
              <NavItem>
                <a style={{ textDecoration: "none" }}>
                <NavLink
                  style={{ cursor: "pointer" }}
                  onClick={() => logout(() => Router.replace("/login"))}
                >
                    Logout
                </NavLink>
                </a>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
