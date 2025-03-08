import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, ListItemIcon, Divider, Button } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import Header from "../components/UI/Header";
import { useAuth } from "../contexts/AuthProvider";
import { signOut } from "../services/auth";


const Layout = () => {
  const { user, userRole, isAdmin, isTeacher, isStudent } = useAuth();

  // Menu items configuration with role-based visibility
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      // Dashboard visible to all authenticated users
      visible: !!user
    },
    {
      text: "Admin Panel",
      icon: <AdminPanelSettingsIcon />,
      path: "/admin",
      // Admin panel only visible to admins
      visible: isAdmin
    },
    {
      text: "Teacher Dashboard",
      icon: <SchoolIcon />,
      path: "/teacher",
      // Teacher dashboard visible to teachers and admins
      visible: isTeacher || isAdmin
    },
    {
      text: "Student Portal",
      icon: <PersonIcon />,
      path: "/student",
      // Student portal visible to all roles (could customize this further)
      visible: isStudent || isTeacher || isAdmin
    },
    {
      text: "Course Management",
      icon: <SchoolIcon />,
      path: "/courses/manage",
      // Course management for teachers and admins
      visible: isTeacher || isAdmin
    },
    {
      text: "User Management",
      icon: <AdminPanelSettingsIcon />,
      path: "/users",
      // User management only for admins
      visible: isAdmin
    }
  ];
  const handleLogout = async ()=>{
    await signOut()
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Filter menu items based on user role */}
            {menuItems
              .filter(item => item.visible)
              .map((item, index) => (
                <ListItem 
                  button 
                  key={item.text}
                  component={RouterLink} 
                  to={item.path}
                  sx={{
                    "&.active": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)"
                    }
                  }}
                >
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
          </List>
          
          {user && (
            <>
              <Divider />
              <List>
                <ListItem>
                  <ListItemText 
                    primary={`Role: ${userRole}`} 
                    secondary={user.email}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary"
                    }}
                    secondaryTypographyProps={{
                      variant: "caption"
                    }}
                  />
                </ListItem>
              </List>
            </>
          )}
        </Box>
        <Button onClick={handleLogout} >Logout</Button>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;