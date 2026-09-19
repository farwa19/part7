import { useEffect, useState } from "react";
import axios from "axios";
import BlogList from "./bloglist";
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Usersblogs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>All users</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>

        
<TableBody>
  {users.map((user) => (
    <TableRow key={user.id || user.username}>

      <TableCell>
        <Link to="/userblogs" state={{ blogs: user.blog, userName: user.name || user.username }}>
          {user.name || user.username}
        </Link>
      </TableCell>

      <TableCell>
        {user.username}
      </TableCell>

      <TableCell>
        {user.blog ? user.blog.length : 0}
      </TableCell>

    </TableRow>
  ))}
</TableBody>


        </Table>
      </TableContainer>
    </div>
  );
};

export default Usersblogs;

