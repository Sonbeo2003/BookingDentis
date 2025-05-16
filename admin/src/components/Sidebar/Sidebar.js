import React from "react";
import logoPet from "../../assets/images/seo-nha-khoa-scaled.jpg";
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ items }) => {
  const location = useLocation();

  return (
    <Drawer classes={{ paper: "sidebar-container" }} variant="permanent">
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <img src={logoPet} alt="Petcare Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Admin</h2>
        </div>
      </div>

      <List className="sidebar-list">
        {items.map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={index}
            className={`sidebar-item ${
              location.pathname === item.link ? "active" : ""
            }`}
          >
            <ListItemIcon
              className={`sidebar-icon ${
                location.pathname === item.link ? "active" : ""
              }`}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;