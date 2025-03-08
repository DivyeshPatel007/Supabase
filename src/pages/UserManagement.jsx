import React, { useEffect, useState } from "react";
//import { supabase } from "../supabaseClient"; // Ensure Supabase is initialized
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography } from "@mui/material";
import { fetchAuthUsers, supabaseClient } from "../services/auth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { users, error } = await fetchAuthUsers()
    console.log({users})
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(users);
    }
    setLoading(false);
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabaseClient.from("users").update({ role: newRole }).eq("id", userId);
    if (error) {
      console.error("Error updating role:", error);
    } else {
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} align="center">Loading...</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagement;