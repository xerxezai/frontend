import React, { useMemo } from "react";
import { menuData } from "../../data";
import type { MenuItem } from "../../types";
import { Link } from "react-router-dom";
import Image from "../utils/Image";

const MainMenuSection = React.memo(() => {
  // Memoize the entire menu structure to prevent re-computation
  const memoizedMenuItems = useMemo(() => {
    return menuData.map((menuItem: MenuItem) => (
      <React.Fragment key={`menu-${menuItem.title}-${menuItem.link}`}>
        {/* Main menu item */}
        <li
          className={`${menuItem.hasDropdown ? "has-dropdown" : ""} ${
            menuItem.isHomemenu ? "menu-thumb" : ""
          }`}
        >
          <Link to={menuItem.link}>
            {menuItem.title}
            {menuItem.hasDropdown && <i className="fas fa-chevron-down"></i>}
          </Link>
          {menuItem.hasDropdown && menuItem.submenu && (
            <ul
              className={`submenu ${menuItem.isHomemenu ? "has-homemenu" : ""}`}
            >
              {menuItem.isHomemenu ? (
                <li>
                  <div className="homemenu-items">
                    <div className="row gx-4 row-cols-2 row-cols-md-2 row-cols-xl-4">
                      {menuItem.submenu.map((subMenuItem: MenuItem) => (
                        <div
                          key={`submenu-${subMenuItem.title}-${subMenuItem.link}`}
                          className="col homemenu"
                        >
                          <div className="homemenu-thumb">
                            <Image
                              src={subMenuItem.img || ""}
                              alt="img"
                              width={217}
                              height={271}
                            />
                            <div className="demo-button">
                              <Link to={subMenuItem.link} className="theme-btn">
                                Demo Page
                              </Link>
                            </div>
                          </div>
                          <div className="homemenu-content text-center">
                            <h4 className="homemenu-title">
                              <Link to={subMenuItem.link}>
                                {subMenuItem.title}
                              </Link>
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                menuItem.submenu.map((subMenuItem: MenuItem) => (
                  <li
                    key={`submenu-${subMenuItem.title}-${subMenuItem.link}`}
                    className={subMenuItem.hasDropdown ? "has-dropdown" : ""}
                  >
                    <Link to={subMenuItem.link}>
                      {subMenuItem.title}
                      {subMenuItem.hasDropdown && (
                        <i className="fas fa-angle-right"></i>
                      )}
                    </Link>
                    {subMenuItem.hasDropdown && subMenuItem.submenu && (
                      <ul className="submenu">
                        {subMenuItem.submenu.map((nestedSubItem: MenuItem) => (
                          <li
                            key={`nested-${nestedSubItem.title}-${nestedSubItem.link}`}
                          >
                            <Link to={nestedSubItem.link}>
                              {nestedSubItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </li>

        {/* Special mobile-only home menu */}
        {menuItem.title === "Home" && (
          <li className="has-dropdown active d-xl-none">
            <Link to="/" className="border-none">
              Home
            </Link>
            {menuItem.submenu && (
              <ul className="submenu">
                {menuItem.submenu.map((subMenuItem: MenuItem) => (
                  <li
                    key={`mobile-home-${subMenuItem.title}-${subMenuItem.link}`}
                  >
                    <Link to={subMenuItem.link}>{subMenuItem.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </React.Fragment>
    ));
  }, [menuData]); // Only re-compute if menuData changes

  return (
    <div className="main-menu">
      <nav id="mobile-menu">
        <ul>{memoizedMenuItems}</ul>
      </nav>
    </div>
  );
});

MainMenuSection.displayName = "MainMenuSection";

export default MainMenuSection;
