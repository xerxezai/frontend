// XerxezMobileMenu.tsx
// Purpose: The accordion nav list inside the /v2 off-canvas mobile menu.
//          Structurally identical to the existing site's MobileMenu
//          (src/components/header/MobileMenu.tsx) — same markup/classes, so
//          it inherits the same "mean-nav" accordion CSS — but every link is
//          passed through XerxezHeader's `remap()` so a visitor stays on /v2/*
//          instead of being dropped onto the legacy page.
// Used in: layout/XerxezMobileMenuModal.tsx
// Data source: existing site nav data (src/data → menuData).

import { useState, useMemo } from "react";
import type { MenuItem } from "../../../types";
import { menuData } from "../../../data";
import { useCustomContext } from "../../../context/context";
import { Link } from "react-router-dom";
import { remap } from "./XerxezHeader";

const XerxezMobileMenu = () => {
  const { toggleMobileMenu } = useCustomContext();
  const [activeMenu, setActiveMenu] = useState<string>("");     // which top-level accordion row is open
  const [activeSubMenu, setActiveSubMenu] = useState<string>(""); // which nested row is open (unused by current data, kept for parity)

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu("");
      setActiveSubMenu("");
    } else {
      setActiveMenu(menu);
      setActiveSubMenu("");
    }
  };

  const toggleSubMenu = (submenu: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setActiveSubMenu((cur) => (cur === submenu ? "" : submenu));
  };

  const renderedMenuItems = useMemo(() => {
    return menuData.map((menuItem: MenuItem, index: number) => (
      <li
        key={`v2-mobile-menu-${menuItem.title}-${menuItem.link}`}
        className={`${menuItem.hasDropdown ? "has-dropdown" : ""} ${
          index === menuData.length - 1 ? "mean-last" : ""
        }`}
      >
        {menuItem.hasDropdown ? (
          <a
            className={`mobile-menu-main-link ${activeMenu === menuItem.title.toLowerCase() ? "active" : ""}`}
            role="button"
            onClick={() => toggleMenu(menuItem.title.toLowerCase())}
          >
            <span>{menuItem.title}</span>
            <i className="far fa-plus"></i>
          </a>
        ) : (
          // remapped — e.g. "/about" → "/v2/about" — so the visitor stays on /v2
          <Link to={remap(menuItem.link)} className="mobile-menu-main-link" role="button" onClick={toggleMobileMenu}>
            {menuItem.title}
          </Link>
        )}

        {menuItem.hasDropdown && menuItem.submenu && (
          <ul className={`submenu ${activeMenu === menuItem.title.toLowerCase() ? "show" : ""}`}>
            {menuItem.submenu.map((subMenuItem: MenuItem) => (
              <li
                key={`v2-mobile-submenu-${subMenuItem.title}-${subMenuItem.link}`}
                className={subMenuItem.hasDropdown ? "has-dropdown" : ""}
              >
                {subMenuItem.hasDropdown && subMenuItem.submenu ? (
                  <>
                    <a
                      href="#"
                      className={`mobile-menu-main-link ${activeSubMenu === subMenuItem.title.toLowerCase() ? "active" : ""}`}
                      role="button"
                      onClick={(e) => toggleSubMenu(subMenuItem.title.toLowerCase(), e)}
                    >
                      <span>{subMenuItem.title}</span>
                      <i className="far fa-plus"></i>
                    </a>
                    <ul className={`submenu ${activeSubMenu === subMenuItem.title.toLowerCase() ? "show" : ""}`}>
                      {subMenuItem.submenu.map((nestedSubItem: MenuItem) => (
                        <li key={`v2-mobile-nested-${nestedSubItem.title}-${nestedSubItem.link}`}>
                          <Link to={remap(nestedSubItem.link)} onClick={toggleMobileMenu}>
                            {nestedSubItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={remap(subMenuItem.link)} onClick={toggleMobileMenu}>
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

export default XerxezMobileMenu;
