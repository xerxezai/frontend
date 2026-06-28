import React, { useState, useEffect } from "react";
import { menuData } from "../../data";
import type { MenuItem } from "../../types";
import { Link, useLocation } from "react-router-dom";

const LINK_DEFAULT = "#e2e8f0";
const LINK_HOVER   = "#cc785c";

const MainMenuSection = () => {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);

  // Reset hover state on navigation — prevents stuck coral after clicking a submenu link
  useEffect(() => {
    setHovered(null);
  }, [pathname]);

  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname === link || pathname.startsWith(link + "/");

  const subLinkStyle = (key: string): React.CSSProperties => ({
    color: hovered === key ? LINK_HOVER : LINK_DEFAULT,
    textDecoration: "none",
    display: "block",
  });

  return (
    <div className="main-menu" style={{ marginLeft: 0 }}>
      <style>{`
        #mobile-menu > ul { gap: 8px !important; }
        #mobile-menu > ul > li > a { padding-left: 13px !important; padding-right: 16px !important; }
      `}</style>
      <nav id="mobile-menu">
        <ul>
          {menuData.map((menuItem: MenuItem) => (
            <React.Fragment key={`menu-${menuItem.title}-${menuItem.link}`}>
              <li
                className={`${menuItem.hasDropdown ? "has-dropdown" : ""} ${
                  menuItem.isHomemenu ? "menu-thumb" : ""
                } ${isActive(menuItem.link) ? "nav-active" : ""}`}
              >
                <Link to={menuItem.link}>
                  {menuItem.title}
                  {menuItem.hasDropdown && <i className="fas fa-chevron-down"></i>}
                </Link>
                {menuItem.hasDropdown && menuItem.submenu && (
                  <ul className={`submenu ${menuItem.isHomemenu ? "has-homemenu" : ""} ${menuItem.title === "Services" ? "submenu--grid" : ""}`}>
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
                                  <img
                                    src={subMenuItem.img || ""}
                                    alt="img"
                                    width={217}
                                    height={271}
                                    style={{ objectFit: "cover" }}
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
                      menuItem.submenu.map((subMenuItem: MenuItem) => {
                        const key = `${menuItem.title}__${subMenuItem.link}`;
                        return (
                          <li
                            key={key}
                            className={subMenuItem.hasDropdown ? "has-dropdown" : ""}
                          >
                            <Link
                              to={subMenuItem.link}
                              style={subLinkStyle(key)}
                              onMouseEnter={() => setHovered(key)}
                              onMouseLeave={() => setHovered(null)}
                            >
                              {subMenuItem.title}
                              {subMenuItem.hasDropdown && (
                                <i className="fas fa-angle-right"></i>
                              )}
                            </Link>
                            {subMenuItem.hasDropdown && subMenuItem.submenu && (
                              <ul className="submenu">
                                {subMenuItem.submenu.map((nestedSubItem: MenuItem) => {
                                  const nestedKey = `${key}__${nestedSubItem.link}`;
                                  return (
                                    <li key={nestedKey}>
                                      <Link
                                        to={nestedSubItem.link}
                                        style={subLinkStyle(nestedKey)}
                                        onMouseEnter={() => setHovered(nestedKey)}
                                        onMouseLeave={() => setHovered(null)}
                                      >
                                        {nestedSubItem.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </li>

              {menuItem.title === "Home" && (
                <li className="has-dropdown active d-xl-none">
                  <Link to="/" className="border-none">Home</Link>
                  {menuItem.submenu && (
                    <ul className="submenu">
                      {menuItem.submenu.map((subMenuItem: MenuItem) => (
                        <li key={`mobile-home-${subMenuItem.title}-${subMenuItem.link}`}>
                          <Link to={subMenuItem.link}>{subMenuItem.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
};

MainMenuSection.displayName = "MainMenuSection";

export default MainMenuSection;
