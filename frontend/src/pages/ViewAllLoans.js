import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../css/ViewAllLoans.css'; // Correct path to ViewAllLoans.css
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewAllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editLoan, setEditLoan] = useState(null);
  const [viewLoan, setViewLoan] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('https://hiru-captial-investment-pvt.onrender.com/api/loan');
        setLoans(response.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching loans.');
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hiru-captial-investment-pvt.onrender.com/api/loan/${id}`);
      setLoans(loans.filter(loan => loan._id !== id));
    } catch (err) {
      setError('An error occurred while deleting the loan.');
    }
  };

  const handleEdit = (loan) => {
    setEditLoan(loan);
  };

  const handleView = (loan) => {
    setViewLoan(loan);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://hiru-captial-investment-pvt.onrender.com/api/loan/${editLoan._id}`, editLoan);
      setLoans(loans.map(loan => (loan._id === editLoan._id ? editLoan : loan)));
      setEditLoan(null);
    } catch (err) {
      setError('An error occurred while updating the loan.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLoan({ ...editLoan, [name]: value });
  };

  // NEW: close modal on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (editLoan) setEditLoan(null);
        if (viewLoan) setViewLoan(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editLoan, viewLoan]);

  // Replace previous simple formatter with a robust parser + formatter
  const formatDate = (value) => {
    if (value == null) return '';
    // Handle MongoDB Extended JSON { $date: "..." } or { $date: { $numberLong: "..." } }
    if (typeof value === 'object') {
      if (value.$date) value = value.$date;
      else if (value['$date']) value = value['$date'];
      else if (value.$numberLong) value = Number(value.$numberLong);
    }

    // If it's a number (timestamp), create Date from it
    let d;
    if (typeof value === 'number') d = new Date(value);
    else d = new Date(value);

    if (isNaN(d.getTime())) return String(value);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="ViewAllLoans" style={{ padding: '20px' }}>
      <h1>All Loans</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* EDIT FORM MOVED INTO MODAL */}
          {editLoan && (
            <div className="modal-overlay" onClick={() => setEditLoan(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setEditLoan(null)} aria-label="Close">×</button>
                <h3>Edit Loan</h3>
                <form onSubmit={handleUpdate} className="modal-form">
                  <label>
                    Customer ID:
                    <input type="text" name="CustomerID" value={editLoan.CustomerID || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Full Name:
                    <input type="text" name="fullname" value={editLoan.fullname || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Email:
                    <input type="email" name="email" value={editLoan.email || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    NIC:
                    <input type="text" name="nic" value={editLoan.nic || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 1:
                    <input type="text" name="garantter1" value={editLoan.garantter1 || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 1 ID:
                    <input type="text" name="garantter1id" value={editLoan.garantter1id || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 1 Address:
                    <input type="text" name="garantter1address" value={editLoan.garantter1address || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 2:
                    <input type="text" name="garantter2" value={editLoan.garantter2 || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 2 ID:
                    <input type="text" name="garantter2id" value={editLoan.garantter2id || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Guarantor 2 Address:
                    <input type="text" name="garantter2address" value={editLoan.garantter2address || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Amount:
                    <input type="number" name="amount" value={editLoan.amount || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Installment:
                    <input type="number" name="installment" value={editLoan.installment || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Installment Rate:
                    <input type="number" name="installmentrate" value={editLoan.installmentrate || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Interest:
                    <input type="number" name="interest" value={editLoan.interest || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Loan End Date:
                    <input type="date" name="loanEndDate" value={editLoan.loanEndDate ? new Date(editLoan.loanEndDate).toISOString().split('T')[0] : ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Total Payment:
                    <input type="number" name="totalPayment" value={editLoan.totalPayment || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Due Payment:
                    <input type="number" name="duePayment" value={editLoan.duePayment || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Fine:
                    <input type="number" name="fine" value={editLoan.fine || ''} onChange={handleChange} required />
                  </label>
                  <label>
                    Create Date:
                    <input type="date" name="createDate" value={editLoan.createDate ? new Date(editLoan.createDate).toISOString().split('T')[0] : ''} onChange={handleChange} required />
                  </label>
                  <div className="modal-actions">
                    <button type="submit">Update Loan</button>
                    <button type="button" onClick={() => setEditLoan(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* NEW: view-only modal */}
          {viewLoan && (
            <div className="modal-overlay" onClick={() => setViewLoan(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setViewLoan(null)} aria-label="Close">×</button>
                <h3>View Loan</h3>
                <div className="modal-form view-readonly">
                  <div className="view-field"><label>ID</label><div className="value">{viewLoan._id}</div></div>
                  <div className="view-field"><label>Customer ID</label><div className="value">{viewLoan.CustomerID}</div></div>
                  <div className="view-field"><label>Full Name</label><div className="value">{viewLoan.fullname}</div></div>
                  <div className="view-field"><label>Email</label><div className="value">{viewLoan.email}</div></div>
                  <div className="view-field"><label>NIC</label><div className="value">{viewLoan.nic}</div></div>
                  <div className="view-field"><label>Guarantor 1</label><div className="value">{viewLoan.garantter1}</div></div>
                  <div className="view-field"><label>Guarantor 1 ID</label><div className="value">{viewLoan.garantter1id}</div></div>
                  <div className="view-field"><label>Guarantor 1 Address</label><div className="value">{viewLoan.garantter1address}</div></div>
                  <div className="view-field"><label>Guarantor 2</label><div className="value">{viewLoan.garantter2}</div></div>
                  <div className="view-field"><label>Guarantor 2 ID</label><div className="value">{viewLoan.garantter2id}</div></div>
                  <div className="view-field"><label>Guarantor 2 Address</label><div className="value">{viewLoan.garantter2address}</div></div>
                  <div className="view-field"><label>Amount</label><div className="value">{viewLoan.amount}</div></div>
                  <div className="view-field"><label>Installment</label><div className="value">{viewLoan.installment}</div></div>
                  <div className="view-field"><label>Installment Rate</label><div className="value">{viewLoan.installmentrate}</div></div>
                  <div className="view-field"><label>Interest</label><div className="value">{viewLoan.interest}</div></div>
                  <div className="view-field"><label>Loan End Date</label><div className="value">{formatDate(viewLoan.loanEndDate)}</div></div>
                  <div className="view-field"><label>Create Date</label><div className="value">{formatDate(viewLoan.createDate)}</div></div>
                  <div className="view-field"><label>Loan Type</label><div className="value">{viewLoan.loanType}</div></div>
        <div className="view-field"><label>Loan Duration</label><div className="value">{viewLoan.loanDuration}</div></div>

        <div className="view-field"><label>Loan End Date</label><div className="value">{formatDate(viewLoan.loanEndDate)}</div></div>
        <div className="view-field"><label>Create Date</label><div className="value">{formatDate(viewLoan.createDate)}</div></div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setViewLoan(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* wrapped table so it can scroll horizontally on small screens */}
          <div className="ViewAllLoans-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No</th> {/* sequence column */}
                  <th>Full Name</th>
                  <th>NIC</th>
                  <th>Amount</th>
                  <th>Installment</th>
                  <th>Interest</th>
                  <th>Loan End Date</th>
                  <th>Total Payment</th>
                  <th>Due Payment</th>
                  <th>Fine</th>
                  <th>Create Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (  // include index here
                  <tr key={loan._id}>
                    <td className="seq-col">{index + 1}</td> {/* sequence cell */}
                    <td>{loan.fullname}</td>
                    <td>{loan.nic}</td>
                    <td>{loan.amount}</td>
                    <td>{loan.installment}</td>
                    <td>{loan.interest}</td>
                    <td>{formatDate(loan.loanEndDate)}</td>
                    <td>{loan.totalPayment}</td>
                    <td>{loan.duePayment}</td>
                    <td>{loan.fine}</td>
                    <td>{formatDate(loan.createDate)}</td> {/* formatted dd/mm/yyyy */}
                    <td className="actions-cell">
                      <button
                        className="icon-btn view"
                        onClick={() => handleView(loan)}
                        title="View"
                        aria-label="View loan"
                      >
                        <VisibilityIcon />
                      </button>

                      <button
                        className="icon-btn edit"
                        onClick={() => handleEdit(loan)}
                        title="Edit"
                        aria-label="Edit loan"
                      >
                        <EditIcon />
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(loan._id)}
                        title="Delete"
                        aria-label="Delete loan"
                      >
                        <DeleteIcon />
                      </button>
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

export default ViewAllLoans;