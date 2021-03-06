// ----------------------------------------------------------------------------
// -------------------------------------------------------------------- Imports
// ----------------------------------------------------------------------------
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Libraries
import React from "react";
import PropTypes from "prop-types";
import { css } from "glamor";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Lodash
import map from "lodash/map";
import isUndefined from "lodash/isUndefined";
import startsWith from "lodash/startsWith";
import split from "lodash/split";
import concat from "lodash/concat";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Components
import Link from "gatsby-link";
import OutLink from "@bodhi-project/components/lib/OutLink";
import { Elements } from "@bodhi-project/typography";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locals

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Abstractions
const { Fragment } = React;
const { Ul } = Elements;

// ----------------------------------------------------------------------------
// --------------------------------------------------------------------- Styles
// ----------------------------------------------------------------------------
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Desktop
const mobileNavStyles = css({
  height: "inherit",
  padding: "0em",

  "& nav": {
    "& ul": {
      listStyle: "none",
      padding: 0,

      "& ul": {
        listStyle: "none",
        paddingLeft: 20,
        marginBottom: 15,
      },

      "& li": {
        marginBottom: 2,
      },

      "& li.header": {
        "& span": {
          fontWeight: 700,
        },

        ":not(:first-child)": {
          marginTop: 25,
        },
      },
    },
  },
});
const mobileNavStylesClass = mobileNavStyles.toString();

// ----------------------------------------------------------------------------
// ------------------------------------------------------------------ Component
// ----------------------------------------------------------------------------
/** MobileNav */
class MobileNav extends React.Component {
  /** standard constructor */
  constructor(props) {
    super(props);
  }

  /** standard renderer */
  render() {
    const { pathname } = this.props.location;
    // const menuX = merge(this.props.menu[0], this.props.menu[1]);
    const menu0 = this.props.menu[0];
    const menu1 = this.props.menu[1];
    const menu01 = concat(menu0, menu1);

    return (
      <div className={mobileNavStylesClass}>
        <nav style={{ marginTop: 20, height: "100%" }}>
          <Ul>
            {map(menu01, menuItem => {
              const { title, link, menu: subMenu } = menuItem;
              return (
                <li key={link}>
                  {isUndefined(subMenu) && (
                    <Link
                      to={link}
                      className={
                        pathname === split(link, "?", 1)[0] ? "active" : ""
                      }
                    >
                      {title}
                    </Link>
                  )}
                  {!isUndefined(subMenu) && (
                    <Fragment>
                      {map(subMenu, subMenu => {
                        const subTitle = subMenu.title;
                        const popMenu = subMenu.menu;
                        const { link } = subMenu;
                        const isOutLink = startsWith(link, "http");

                        return (
                          <Fragment>
                            {isUndefined(popMenu) && (
                              <li key={link}>
                                {isOutLink === true && (
                                  <OutLink to={link}>
                                    <span>{subTitle}</span>
                                  </OutLink>
                                )}
                                {isOutLink === false && (
                                  <Link
                                    to={link}
                                    className={
                                      pathname === split(link, "?", 1)[0]
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <span>{subTitle}</span>
                                  </Link>
                                )}
                              </li>
                            )}
                            {!isUndefined(popMenu) && (
                              <li key={subTitle}>
                                {isOutLink === true && (
                                  <OutLink to={link}>{subTitle}</OutLink>
                                )}
                                {isOutLink === false && (
                                  <Fragment>
                                    <span>{subTitle}</span>
                                    <span style={{ fontSize: "88%" }}>
                                      &nbsp;»
                                    </span>
                                    <ul>
                                      {map(popMenu, popMenuItem => {
                                        const itemTitle = popMenuItem.title;
                                        const itemLink = popMenuItem.link;
                                        const isItemLinkOutLink = startsWith(
                                          itemLink,
                                          "http",
                                        );
                                        return (
                                          <li key={itemLink}>
                                            {isItemLinkOutLink === true && (
                                              <OutLink to={itemLink}>
                                                <span>{itemTitle}</span>
                                              </OutLink>
                                            )}
                                            {isItemLinkOutLink === false && (
                                              <Link
                                                to={itemLink}
                                                className={
                                                  pathname ===
                                                  split(itemLink, "?", 1)[0]
                                                    ? "active"
                                                    : ""
                                                }
                                              >
                                                <span>{itemTitle}</span>
                                              </Link>
                                            )}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Fragment>
                                )}
                              </li>
                            )}
                          </Fragment>
                        );
                      })}
                    </Fragment>
                  )}
                </li>
              );
            })}
          </Ul>
        </nav>
      </div>
    );
  }
}

MobileNav.propTypes = {
  menu: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

// --------------------------------------------------------------------- Export
export default MobileNav;
