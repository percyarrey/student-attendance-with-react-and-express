import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios"

import Student from './Components/Student';
import Modal from 'react-modal'
function App() {
  const backendUrl = 'http://localhost:4000/api/students'
  const [students, setStudents] = useState([
  ]);

  /* GETTING STUDENTS */
  useEffect(() => {
    axios.get(backendUrl).then(res => setStudents(res.data)).catch(err => console.log(err))
  }, [])

  /* UPDATING STUDENTS */
  const [editingStudent, setEditingStudent] = useState(null);
  function handleEditStudent(data) {
    setEditingStudent(data)
    setStudentData({
      matricule: data.matricule,
      name: data.name,
      level: data.level,
      status: data.status
    })
    setIsModalOpen(true)
  }

  /* DELETING STUDENT */
  const [deleteStudent, setDeleteStudent] = useState([]);
  const updateDeleteStudent = (e, id) => {
    if (e) {
      if (e.target.checked === true) {
        setDeleteStudent([...deleteStudent, id]);
      } else {
        setDeleteStudent(deleteStudent.filter(e => e !== id))
      }
    } else {
      if (!deleteStudent.includes(id)) {
        axios.delete(`${backendUrl}`, {
          data: {
            ids: [id]
          }
        })
          .then(response => {
            console.log(response.data.message);
            // Remove the successfully deleted IDs from the deleteStudent array
            setDeleteStudent(deleteStudent.filter(id => !deleteStudent.includes(id)));
            setStudents(students.filter(e => e._id !== id))
          })
          .catch(error => {
            console.error(error.response.data.message);
            // Add the IDs that were not found to the deleteStudent array
            setDeleteStudent([...deleteStudent, ...error.response.data.notFoundIds]);
          });
      }
    }
  }
  const handleDeleteStudent = (data) => {
    axios.delete(`${backendUrl}`, {
      data: {
        ids: deleteStudent
      }
    })
      .then(response => {
        console.log(response.data.message);
        // Remove the successfully deleted IDs from the deleteStudent array
        setDeleteStudent(deleteStudent.filter(id => !deleteStudent.includes(id)));
        deleteStudent.forEach(id => {
          setStudents(students.filter(e => e._id !== id))
        })
      })
      .catch(error => {
        console.error(error.response.data.message);
        // Add the IDs that were not found to the deleteStudent array
        setDeleteStudent([...deleteStudent, ...error.response.data.notFoundIds]);
      });
  }

  /* SELECT */
  const selectAllStudent = (e) => {
    if (e.target.checked) {
      const newDeleteStudent = students.map(student => student._id);
      setDeleteStudent(newDeleteStudent);
    } else {
      setDeleteStudent([]);
    }
  };

  /* SEARCH */
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    setSearch(e.target.value);
    axios.get(`${backendUrl}?search=${e.target.value}`)
      .then(res => {
        console.log(res.data)
        setStudents(res.data)
      })
      .catch(err => console.log(err));
  }

  /*  MODAL */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState({
    matricule: '',
    name: '',
    level: '',
    status: '',
  });
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      axios.put(`${backendUrl}/${editingStudent._id}`, studentData).then(res => {
        const updatedStudents = students.map(student => {
          if (student._id === editingStudent._id) {
            return res.data;
          }
          return student;
        });
        setStudents(updatedStudents);
        setEditingStudent(null);
        setIsModalOpen(false);
      }).catch(err => console.log(err))
    } else {
      axios.post(backendUrl, studentData).then(res => {
        setStudents([...students, res.data]);
        setIsModalOpen(false);
      }).catch(err => console.log(err))
    }
  }
  return (
    <>
      <div className='container py-5'>
        <div className='fs-2 fw-bold text-success'>
          ATTENDANCE LIST
        </div>

        <div className='mt-4 border border-1 border-secondary rounded-2 pt-5 pb-5 shadow-sm container-fluid'>
          <div className=' w-50 ms-auto pe-3'>
            <input placeholder='Search a student' value={search} onChange={handleSearch} className='form-control py-2' />
          </div>

          <div className='d-flex justify-content-between mt-5 px-3'>
            <button className='btn btn-success' onClick={() => {
              setStudentData({
                matricule: '',
                name: '',
                level: '',
                status: '',
              }); setIsModalOpen(true)
            }}>Add a student</button>
            <button
              onClick={handleDeleteStudent}
              className={`btn btn-danger ${deleteStudent.length === 0 ? 'disabled' : ''}`}
            >
              Delete Selected
            </button>
          </div>
          <div className='row fw-bold mt-4 border border-0 border-secondary border-bottom p-2 pt-3 shadow-sm mb-3 bg-secondary bg-opacity-10 rounded-top-'>
            <div className='col-1'><input type='checkbox' onChange={e => { selectAllStudent(e) }} /></div>
            <div className='col-2'>MATRICULE</div>
            <div className='col-2'>NAME</div>

            <div className='col-2'>LEVEL</div>
            <div className='col-2'>STATUS</div>
            <div className='col-2'>ACTION</div>
          </div>
          <div className='row'>
            <div className='col-12'>
              {
                students.map(e => {
                  return (
                    <Student key={e._id} data={e} handleEditStudent={handleEditStudent} deleteStudent={deleteStudent} updateDeleteStudent={updateDeleteStudent} handleDeleteStudent={handleDeleteStudent} />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

      <Modal
        appElement={document.getElementById('root')}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Student"
      >
        <h2>{editingStudent ? 'Edit' : 'Add'} Student</h2>
        <form
          className='flex flex-column'
          onSubmit={handleModalSubmit}
        >
          <div>
            <label className='w-full'>
              Matricule:
            </label>
            <input
              type="text"
              className='form-control'
              value={studentData.matricule}
              onChange={(e) =>
                setStudentData({ ...studentData, matricule: e.target.value })
              }
            />
          </div>
          <div>
            <label>
              Name:
            </label>
            <input
              type="text"
              className='form-control'
              value={studentData.name}
              onChange={(e) =>
                setStudentData({ ...studentData, name: e.target.value })
              }
            />
          </div>
          <div><label>
            Level:
          </label>
            <input
              type="number"
              className='form-control'
              value={studentData.level}
              onChange={(e) =>
                setStudentData({ ...studentData, level: e.target.value })
              }
            /></div>
          <div>
            <label>
              Status:
            </label>
            <select
              className='form-control'
              value={studentData.status}
              onChange={(e) =>
                setStudentData({ ...studentData, status: e.target.value })
              }
            >
              <option value="" className='opacity-25'>Choose a status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className=' d-flex justify-content-between mt-3'>
            <button className='btn btn-success' type="submit">Save</button>
            <button className='btn btn-danger' onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default App


