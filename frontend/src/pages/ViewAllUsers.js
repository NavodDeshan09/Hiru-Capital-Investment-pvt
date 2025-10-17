import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import './../css/ViewAllUsers.css'; // Correct path to ViewAllUsers.css
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewAllUsers = () => {
  // State to hold the users and loading status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);

  // Fetch all users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please login.');
          setLoading(false);
          return;
        }

        // Send GET request to the backend with the Authorization header
        const response = await axios.get('https://hiru-captial-investment-pvt.onrender.com/api/users/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data); // Store users in the state
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError('An error occurred while fetching users.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const handleDelete = async (id) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      await axios.delete(`https://hiru-captial-investment-pvt.onrender.com/api/users/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('An error occurred while deleting the user.');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        return;
      }

      await axios.put(`https://hiru-captial-investment-pvt.onrender.com/api/users/user/${editUser._id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.map(user => (user._id === editUser._id ? editUser : user)));
      setEditUser(null);
    } catch (err) {
      setError('An error occurred while updating the user.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // NEW: close modal on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && editUser) {
        setEditUser(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editUser]);

  return (
    <div className="ViewAllUsers">
      <h1>All Users</h1>

      {loading ? (
        <p>Loading...</p> // Show loading message while data is being fetched
      ) : error ? (
        <p className="error">{error}</p> // Display error message if fetching fails
      ) : (
        <>
          {/* EDIT FORM MOVED INTO MODAL */}
          {editUser && (
            <div className="modal-overlay" onClick={() => setEditUser(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setEditUser(null)} aria-label="Close">×</button>
                <h3>Edit User</h3>
                <form onSubmit={handleUpdate} className="modal-form">
                  <label>
                    Name:
                    <input type="text" name="username" value={editUser.username || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Email:
                    <input type="email" name="email" value={editUser.email || ''} onChange={handleChange} required />
                  </label>
                  <div className="modal-actions">
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="ViewAllUsers-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="seq-col">{index + 1}</td> {/* sequence cell */}
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(user)} className="icon-btn edit" title="Edit" aria-label="Edit user"><EditIcon /></button>
                      <button onClick={() => handleDelete(user._id)} className="icon-btn delete" title="Delete" aria-label="Delete user"><DeleteIcon /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAllUsers;
