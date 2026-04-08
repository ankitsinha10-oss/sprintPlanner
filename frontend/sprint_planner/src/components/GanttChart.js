import React from 'react';

const GanttChart = ({ sprint, tasks }) => {
  // 1. Generate array of dates between sprint start and end
  const getDates = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const sprintDates = getDates(sprint.startDate, sprint.endDate);

  // 2. Helper to check if a task falls on a specific date
  const isTaskOnDate = (taskDate, checkDate) => {
    const d1 = new Date(taskDate);
    return d1.toDateString() === checkDate.toDateString();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-borderless mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th style={{ minWidth: '200px' }} className="ps-4 py-3 text-muted small text-uppercase">Task / Member</th>
              <th className="text-muted small text-uppercase">Status</th>
              {sprintDates.map((date, index) => (
                <th key={index} className="text-center small fw-bold" style={{ minWidth: '80px' }}>
                  {date.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sprint.employees.map(emp => (
              <React.Fragment key={emp._id}>
                {/* Employee Header Row */}
                <tr className="bg-light-subtle">
                  <td colSpan={sprintDates.length + 2} className="ps-4 py-2 fw-bold text-primary">
                    {emp.name} <span className="badge bg-primary-subtle text-primary ms-2">{tasks.filter(t => t.assignedTo?._id === emp._id).length} tasks</span>
                  </td>
                </tr>
                
                {/* Task Rows for this Employee */}
                {tasks.filter(t => t.assignedTo?._id === emp._id).map(task => (
                  <tr key={task._id} className="border-bottom">
                    <td className="ps-4 small fw-medium">{task.taskname}</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        task.status === 'completed' ? 'bg-success-subtle text-success' : 
                        task.status === 'inprogress' ? 'bg-info-subtle text-info' : 'bg-light text-dark border'
                      } small`}>
                        {task.status}
                      </span>
                    </td>
                    {sprintDates.map((date, index) => {
                                                                                                                                                                                                            // Logic: If task spans multiple days, you'd calculate width. 
                                                                                                                                                                                                            // Simple version: Show a dot or bar on the specific Due Date
                      const active = isTaskOnDate(task.endDate || task.updatedAt, date);
                      
                      return (
                        <td key={index} className="p-0 position-relative" style={{ height: '50px' }}>
                          {active && (
                            <div 
                              className={`position-absolute top-50 translate-middle-y rounded-pill shadow-sm px-2 d-flex align-items-center justify-content-center text-white small fw-bold ${
                                task.status === 'completed' ? 'bg-success' : 'bg-primary'
                              }`}
                            
                              style={{ height: '24px', width: '100px', zIndex: 2, fontSize: '10px', left: '25px' }}
                            >
                              {task.taskname.substring(0, 10)}...
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="card-footer bg-white border-0 py-3 d-flex gap-4 ps-4">
        <div className="d-flex align-items-center small"><div className="rounded-circle bg-success me-2" style={{width: '10px', height: '10px'}}></div> Done</div>
        <div className="d-flex align-items-center small"><div className="rounded-circle bg-primary me-2" style={{width: '10px', height: '10px'}}></div> In Progress</div>
      </div>
    </div>
  );
};

export default GanttChart;

