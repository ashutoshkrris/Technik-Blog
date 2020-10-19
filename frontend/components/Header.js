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
                <Link href="/blogs">
                  <NavLink style={{ cursor: "pointer" }}>Blogs</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>
            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Sign Up</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/login">
                    <NavLink style={{ cursor: "pointer" }}>Log In</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink style={{ cursor: "pointer" }}>{`${
                    isAuth().name.split(" ")[0]
                  }'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink style={{ cursor: "pointer" }}>{`${
                    isAuth().name.split(" ")[0]
                  }'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  onClick={() => logout(() => Router.replace("/login"))}
                >
                  Logout
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
