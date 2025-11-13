// components/UserList.jsx - Online users list component

import React from 'react';
import './UserList.css';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h3>Online Users ({users.length})</h3>
      <div className="users-container">
        {users.length === 0 ? (
          <p className="no-users">No users online</p>
        ) : (
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="default-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  <span className="user-status">🟢 Online</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserList;
