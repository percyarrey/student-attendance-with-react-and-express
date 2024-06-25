import React from 'react'
import * as Icon from 'react-bootstrap-icons'
function Student({ data, handleEditStudent, updateDeleteStudent, deleteStudent }) {
    return (
        <div className='row border border-0 border-secondary border-bottom border-opacity-50 p-2 shadow-sm mb-3'>
            <div className='col-1'><input type='checkbox' checked={deleteStudent.includes(data._id)} onChange={(e) => { updateDeleteStudent(e, data._id) }} /></div>
            <div className='col-2'>{data.matricule}</div>
            <div className='col-2'>{data.name}</div>

            <div className='col-2'>{data.level}</div>
            <div className='col-2'>{data.status === 'Present' ? <div className='btn btn-success w-50  fw-semibold d-flex align-items-center'><Icon.Check2Circle /> Present</div> : data.status === 'Late' ? <div className='btn btn-warning w-50 fw-semibold '><Icon.DashCircle /> Late</div> : <div className='btn btn-danger w-50 fw-semibold d-flex align-items-center'> <Icon.XCircle /> Absent</div>}</div>
            <div className='col-2 d-flex justify-content-around'><Icon.PencilSquare cursor={'pointer'} color='#198754' onClick={() => { handleEditStudent(data) }} /> <Icon.Trash color='red' cursor={'pointer'} onClick={() => { updateDeleteStudent(undefined, data._id) }} /></div>
        </div>
    )
}

export default Student