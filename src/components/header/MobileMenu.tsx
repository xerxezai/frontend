import React, { useState, useMemo } from "react";
import type { MenuItem } from "../../types";
import { menuData } from "../../data";
import { useCustomContext } from "../../context/context";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const { toggleMobileMenu } = useCustomContext();
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [activeSubMenu, setActiveSubMenu] = useState<string>("");

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu("");
      setActiveSubMenu(""); // Reset submenu when closing main menu
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(""); // Reset submenu when switching main menu
    }
  };

  const toggleSubMenu = (submenu: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (activeSubMenu === submenu) {
      setActiveSubMenu("");
    } else {
      setActiveSubMenu(submenu);
    }
  };

  const renderedMenuItems = useMemo(() => {
    return menuData.map((menuItem: MenuItem, index: number) => (
      <li
        key={`mobile-menu-${menuItem.title}-${menuItem.link}`}
        className={`${menuItem.hasDropdown ? "has-dropdown" : ""} ${
          index === menuData.length - 1 ? "mean-last" : ""
        }`}
      >
        {menuItem.hasDropdown ? (
          <a
            className={`mobile-menu-main-link ${
              activeMenu === menuItem.title.toLowerCase() ? "active" : ""
            }`}
            role="button"
            onClick={() => toggleMenu(menuItem.title.toLowerCase())}
          >
            <span>{menuItem.title}</span>
            <i className="far fa-plus"></i>
          </a>
        ) : (
          <Link
            to={menuItem.link}
            className="mobile-menu-main-link"
            role="button"
            onClick={toggleMobileMenu}
          >
            {menuItem.title}
          </Link>
        )}

        {menuItem.hasDropdown && menuItem.submenu && (
          <ul
            className={`submenu ${
              activeMenu === menuItem.title.toLowerCase() ? "show" : ""
            }`}
          >
            {menuItem.submenu.map((subMenuItem: MenuItem) => (
              <li
                key={`mobile-submenu-${subMenuItem.title}-${subMenuItem.link}`}
                className={subMenuItem.hasDropdown ? "has-dropdown" : ""}
              >
                {subMenuItem.hasDropdown && subMenuItem.submenu ? (
                  <>
                    <a
                      href="#"
                      className={`mobile-menu-main-link ${
                        activeSubMenu === subMenuItem.title.toLowerCase()
                          ? "active"
                          : ""
                      }`}
                      role="button"
                      onClick={(e) =>
                        toggleSubMenu(subMenuItem.title.toLowerCase(), e)
                      }
                    >
                      <span>{subMenuItem.title}</span>
                      <i className="far fa-plus"></i>
                    </a>
                    <ul
                      className={`submenu ${
                        activeSubMenu === subMenuItem.title.toLowerCase()
                          ? "show"
                          : ""
                      }`}
                    >
                      {subMenuItem.submenu.map((nestedSubItem: MenuItem) => (
                        <li
                          key={`mobile-nested-${nestedSubItem.title}-${nestedSubItem.link}`}
                        >
                          <Link
                            to={nestedSubItem.link}
                            onClick={(e) => {
                              toggleMobileMenu(), e;
                            }}
                          >
                            {nestedSubItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={subMenuItem.link}
                    onClick={(e) => {
                      toggleMobileMenu(), e;
                    }}
                  >
                    {subMenuItem.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  }, [activeMenu, activeSubMenu, toggleMobileMenu]);

  return (
    <div className="mt-3 mean-container">
      <div className="mean-bar">
        <nav className="mean-nav">
          <ul>{renderedMenuItems}</ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
