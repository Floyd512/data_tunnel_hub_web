import { useState } from 'react';
import { MdEdit, MdDelete, MdMoreVert, MdPlayArrow } from 'react-icons/md';
import styles from './TaskList.module.css';

interface Task {
  id: string;
  name: string;
  sourceType: string;
  creator: string;
  createTime: string;
  updateTime: string;
}

const TaskList = () => {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      name: '数据同步任务-01',
      sourceType: 'MySQL',
      creator: 'Admin',
      createTime: '2024-03-20 10:00:00',
      updateTime: '2024-03-20 15:30:00'
    },
    {
      id: '2',
      name: '数据清洗任务-02',
      sourceType: 'PostgreSQL',
      creator: 'Admin',
      createTime: '2024-03-20 11:00:00',
      updateTime: '2024-03-20 16:00:00'
    },
    {
      id: '3',
      name: '数据转换任务-03',
      sourceType: 'Oracle',
      creator: 'Admin',
      createTime: '2024-03-20 12:00:00',
      updateTime: '2024-03-20 17:00:00'
    }
  ]);

  const handleExecute = (id: string) => {
    console.log('执行任务:', id);
  };

  const handleEdit = (id: string) => {
    console.log('编辑任务:', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除任务:', id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>同步任务列表</h2>
        <button className={styles.addButton}>新建任务</button>
      </div>
      <div className={styles.taskList}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>任务名称</th>
                <th>数据源类型</th>
                <th>创建时间</th>
                <th>更新时间</th>
                <th>创建人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.sourceType}</td>
                  <td>{task.createTime}</td>
                  <td>{task.updateTime}</td>
                  <td>{task.creator}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleExecute(task.id)}
                        title="执行"
                      >
                        <div className={styles.buttonContent}>
                          <MdPlayArrow />
                          <span>执行</span>
                        </div>
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleEdit(task.id)}
                        title="编辑"
                      >
                        <div className={styles.buttonContent}>
                          <MdEdit />
                          <span>编辑</span>
                        </div>
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleDelete(task.id)}
                        title="删除"
                      >
                        <div className={styles.buttonContent}>
                          <MdDelete />
                          <span>删除</span>
                        </div>
                      </button>
                      <button 
                        className={styles.actionButton}
                        title="更多"
                      >
                        <div className={styles.buttonContent}>
                          <MdMoreVert />
                          <span>更多</span>
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList; 