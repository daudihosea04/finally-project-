import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const { colors, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Section titles and icons
  const sectionTitles = {
    'dashboard': 'Dashboard Overview',
    'user-management': 'User Management Overview',
    'manage-users': 'Manage Users',
    'role-assignment': 'Role Assignment',
    'user-activity': 'User Activity',
    '2fa-enforcement': '2FA Enforcement',
    'course-management': 'Course Management',
    'departments': 'Departments',
    'academic-calendar': 'Academic Calendar',
    'announcements': 'Announcements',
    'groups-rooms': 'Groups & Rooms',
    'notifications': 'Notifications',
    'database-backup': 'Database Backup',
    'file-storage': 'File Storage',
    'system-health': 'System Health',
    'system-logs': 'System Logs',
    'maintenance': 'Maintenance',
    'compliance': 'Compliance',
    'api-keys': 'API Keys',
    'email-config': 'Email Config',
    'sms-gateway': 'SMS Gateway',
    'analytics': 'Analytics',
    'reports': 'Reports',
    'import-export': 'Import/Export',
  };

  const sectionIcons = {
    'dashboard': '📊',
    'user-management': '👥',
    'manage-users': '📋',
    'role-assignment': '🎭',
    'user-activity': '📊',
    '2fa-enforcement': '🔐',
    'course-management': '📚',
    'departments': '🏛️',
    'academic-calendar': '📅',
    'announcements': '📢',
    'groups-rooms': '👥',
    'notifications': '🔔',
    'database-backup': '💾',
    'file-storage': '📁',
    'system-health': '🩺',
    'system-logs': '📜',
    'maintenance': '🔧',
    'compliance': '⚖️',
    'api-keys': '🔑',
    'email-config': '📧',
    'sms-gateway': '📱',
    'analytics': '📈',
    'reports': '📑',
    'import-export': '🔄',
  };

  // Sample data
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@ucc.ac.tz', role: 'Student', status: 'Active' },
    { id: 2, name: 'Prof. Sarah Johnson', email: 'sarah@ucc.ac.tz', role: 'Lecturer', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@ucc.ac.tz', role: 'Admin', status: 'Active' },
  ];

  const sampleCourses = [
    { id: 1, code: 'CS101', title: 'Programming Fundamentals', credits: 3, lecturer: 'Prof. Sarah', students: 45 },
    { id: 2, code: 'CS201', title: 'Database Systems', credits: 3, lecturer: 'Dr. James', students: 38 },
  ];

  const sampleAnnouncements = [
    { id: 1, title: 'Midterm Examinations', content: 'Midterm exams begin April 15th', date: '2024-03-18', priority: 'High', views: 1245 },
    { id: 2, title: 'Course Registration', content: 'Registration opens March 25th', date: '2024-03-17', priority: 'Medium', views: 892 },
  ];

  const sampleGroups = [
    { id: 1, name: 'CS101 Study Group', members: 45, messages: 1234, status: 'Active' },
    { id: 2, name: 'Programming Forum', members: 128, messages: 3456, status: 'Active' },
  ];

  const sampleNotifications = [
    { id: 1, title: 'New Assignment', message: 'Prof. Sarah posted a new assignment', date: '2024-03-18' },
  ];

  const sampleBackups = [
    { id: 1, name: 'Full Backup', date: '2024-03-18', size: '2.4 GB', status: 'Completed' },
  ];

  const sampleActivities = [
    { id: 1, user: 'John Doe', action: 'Submitted assignment', time: '2 min ago' },
    { id: 2, user: 'Prof. Sarah', action: 'Created new course', time: '5 min ago' },
  ];

  const sampleDepartments = [
    { id: 1, name: 'Computer Science', head: 'Prof. Sarah Johnson', courses: 12, students: 450 },
    { id: 2, name: 'Information Technology', head: 'Dr. James Mwangi', courses: 10, students: 380 },
  ];

  const sampleApiKeys = [
    { id: 1, name: 'Mobile App Key', lastUsed: '2024-03-18', requests: 12450, status: 'Active' },
  ];

  const sampleLogs = [
    { id: 1, timestamp: '2024-03-18 10:30:00', user: 'admin@ucc.ac.tz', action: 'User Created', severity: 'Info' },
  ];

  const sampleFiles = [
    { id: 1, name: 'Lecture Notes.pdf', type: 'PDF', size: '2.4 MB', uploader: 'Prof. Sarah', downloads: 45 },
  ];

  // ========== RENDER FUNCTIONS ==========

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-3xl font-bold" style={{ color: colors.primary }}>1,250</div>
          <div style={{ color: colors.textSecondary }}>Total Users</div>
        </div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-3xl font-bold text-green-500">892</div>
          <div style={{ color: colors.textSecondary }}>Active Today</div>
        </div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-3xl font-bold text-blue-500">48</div>
          <div style={{ color: colors.textSecondary }}>Active Courses</div>
        </div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-3xl font-bold text-purple-500">99.9%</div>
          <div style={{ color: colors.textSecondary }}>Uptime</div>
        </div>
      </div>
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Recent Activity</h2>
        {sampleActivities.map(activity => (
          <div key={activity.id} className="flex justify-between p-2 rounded" style={{ backgroundColor: `${colors.primary}05` }}>
            <span style={{ color: colors.textPrimary }}>{activity.user}</span>
            <span style={{ color: colors.textSecondary }}>{activity.action}</span>
            <span className="text-xs" style={{ color: colors.textSubtle }}>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>1,250</div>
          <div style={{ color: colors.textSecondary }}>Total Users</div>
        </div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold text-green-500">892</div>
          <div style={{ color: colors.textSecondary }}>Active Users</div>
        </div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold text-yellow-500">187</div>
          <div style={{ color: colors.textSecondary }}>New This Month</div>
        </div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold text-cyan-500">78%</div>
          <div style={{ color: colors.textSecondary }}>Engagement</div>
        </div>
      </div>
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>User Management Overview</h2>
        <p style={{ color: colors.textSecondary }}>Manage all platform users, roles, and permissions.</p>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Add User</button>
          <button className="px-4 py-2 rounded-lg text-sm" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Bulk Import</button>
        </div>
      </div>
    </div>
  );

  const renderManageUsers = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex justify-between">
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>All Users</h2>
          <button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Add User</button>
        </div>
      </div>
      <table className="w-full">
        <thead style={{ backgroundColor: isDark ? `${colors.primary}10` : '#f9fafb' }}>
          <tr>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Role</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleUsers.map(user => (
            <tr key={user.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3" style={{ color: colors.textPrimary }}>{user.name}</td>
              <td className="px-5 py-3" style={{ color: colors.textSecondary }}>{user.email}</td>
              <td className="px-5 py-3"><span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{user.role}</span></td>
              <td className="px-5 py-3"><span className="text-green-500">● {user.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRoleAssignment = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Role Permissions Matrix</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: colors.border }}>
            <th className="p-3 text-left">Permission</th>
            <th className="p-3 text-center">Admin</th>
            <th className="p-3 text-center">Lecturer</th>
            <th className="p-3 text-center">Student</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b" style={{ borderColor: colors.border }}>
            <td className="p-3">Manage Users</td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">❌</td>
            <td className="p-3 text-center">❌</td>
          </tr>
          <tr className="border-b" style={{ borderColor: colors.border }}>
            <td className="p-3">Create Courses</td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">❌</td>
          </tr>
          <tr className="border-b" style={{ borderColor: colors.border }}>
            <td className="p-3">View Grades</td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">✅</td>
            <td className="p-3 text-center">✅</td>
          </tr>
        </tbody>
      </table>
      <button className="mt-5 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Edit Permissions</button>
    </div>
  );

  const renderUserActivity = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Recent User Activity</h2>
      </div>
      {sampleActivities.map(activity => (
        <div key={activity.id} className="p-4 flex justify-between border-t" style={{ borderColor: colors.border }}>
          <span style={{ color: colors.textPrimary }}>{activity.user}</span>
          <span style={{ color: colors.textSecondary }}>{activity.action}</span>
          <span style={{ color: colors.textSubtle }}>{activity.time}</span>
        </div>
      ))}
    </div>
  );

  const render2FA = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>2FA Enforcement</h2>
      <div className="space-y-3">
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>Admins</span>
          <span className="text-green-500">● Enforced (100%)</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>Lecturers</span>
          <span className="text-yellow-500">● Optional (45%)</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>Students</span>
          <span className="text-gray-500">● Not Enforced</span>
        </div>
      </div>
      <button className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Configure 2FA Policy</button>
    </div>
  );

  const renderCourseManagement = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b flex justify-between" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>All Courses</h2>
        <button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Add Course</button>
      </div>
      <table className="w-full">
        <thead style={{ backgroundColor: isDark ? `${colors.primary}10` : '#f9fafb' }}>
          <tr>
            <th className="px-5 py-3">Code</th>
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Credits</th>
            <th className="px-5 py-3">Lecturer</th>
            <th className="px-5 py-3">Students</th>
          </tr>
        </thead>
        <tbody>
          {sampleCourses.map(course => (
            <tr key={course.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3">{course.code}</td>
              <td className="px-5 py-3">{course.title}</td>
              <td className="px-5 py-3">{course.credits}</td>
              <td className="px-5 py-3">{course.lecturer}</td>
              <td className="px-5 py-3">{course.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDepartments = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex justify-between">
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Departments</h2>
          <button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Add Department</button>
        </div>
      </div>
      <table className="w-full">
        <thead style={{ backgroundColor: isDark ? `${colors.primary}10` : '#f9fafb' }}>
          <tr>
            <th className="px-5 py-3">Department</th>
            <th className="px-5 py-3">Head</th>
            <th className="px-5 py-3">Courses</th>
            <th className="px-5 py-3">Students</th>
          </tr>
        </thead>
        <tbody>
          {sampleDepartments.map(dept => (
            <tr key={dept.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3">{dept.name}</td>
              <td className="px-5 py-3">{dept.head}</td>
              <td className="px-5 py-3">{dept.courses}</td>
              <td className="px-5 py-3">{dept.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAcademicCalendar = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Academic Calendar 2024</h2>
      <div className="space-y-3">
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>📅 Registration Period</span>
          <span>Mar 25 - Apr 10, 2024</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>📚 Lectures Begin</span>
          <span>Apr 15, 2024</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>✏️ Midterm Exams</span>
          <span>Jun 10 - Jun 20, 2024</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>📝 Final Exams</span>
          <span>Aug 5 - Aug 20, 2024</span>
        </div>
      </div>
      <button className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Edit Calendar</button>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Platform Announcements</h2>
        <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Create</button>
      </div>
      {sampleAnnouncements.map(ann => (
        <div key={ann.id} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
          <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{ann.title}</h3>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{ann.content}</p>
          <div className="flex gap-3 mt-2 text-xs" style={{ color: colors.textSubtle }}>
            <span>📅 {ann.date}</span>
            <span>👁️ {ann.views} views</span>
            <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FF444420', color: '#FF4444' }}>{ann.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupsRooms = () => (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Groups & Rooms</h2>
        <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Create Group</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sampleGroups.map(group => (
          <div key={group.id} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{group.name}</h3>
            <div className="flex gap-3 mt-2 text-sm" style={{ color: colors.textSecondary }}>
              <span>👥 {group.members}</span>
              <span>💬 {group.messages}</span>
              <span className="text-green-500">● {group.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Notifications</h2>
        <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Send</button>
      </div>
      {sampleNotifications.map(notif => (
        <div key={notif.id} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
          <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{notif.title}</h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{notif.message}</p>
          <div className="mt-2 text-xs" style={{ color: colors.textSubtle }}>{notif.date}</div>
        </div>
      ))}
    </div>
  );

  const renderDatabaseBackup = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Database Backups</h2>
      </div>
      <table className="w-full">
        <tbody>
          {sampleBackups.map(backup => (
            <tr key={backup.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3">{backup.name}</td>
              <td className="px-5 py-3">{backup.date}</td>
              <td className="px-5 py-3">{backup.size}</td>
              <td className="text-green-500">✓ {backup.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-5 border-t" style={{ borderColor: colors.border }}>
        <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Run Backup</button>
      </div>
    </div>
  );

  const renderFileStorage = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>File Storage</h2>
      </div>
      <table className="w-full">
        <thead style={{ backgroundColor: isDark ? `${colors.primary}10` : '#f9fafb' }}>
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Size</th>
            <th className="px-5 py-3">Uploader</th>
            <th className="px-5 py-3">Downloads</th>
          </tr>
        </thead>
        <tbody>
          {sampleFiles.map(file => (
            <tr key={file.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3">{file.name}</td>
              <td className="px-5 py-3">{file.type}</td>
              <td className="px-5 py-3">{file.size}</td>
              <td className="px-5 py-3">{file.uploader}</td>
              <td className="px-5 py-3">{file.downloads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h3 className="font-bold mb-3">Server Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between"><span>API Server</span><span className="text-green-500">● Operational</span></div>
          <div className="flex justify-between"><span>Database</span><span className="text-green-500">● Connected</span></div>
        </div>
      </div>
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h3 className="font-bold mb-3">Resource Usage</h3>
        <div className="flex justify-between"><span>CPU: 45%</span><span>RAM: 62%</span></div>
        <div className="flex justify-between mt-2"><span>Disk: 49%</span><span>Network: 28%</span></div>
      </div>
    </div>
  );

  const renderSystemLogs = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>System Logs</h2>
      </div>
      <table className="w-full">
        <thead style={{ backgroundColor: isDark ? `${colors.primary}10` : '#f9fafb' }}>
          <tr>
            <th className="px-5 py-3">Timestamp</th>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Action</th>
            <th className="px-5 py-3">Severity</th>
          </tr>
        </thead>
        <tbody>
          {sampleLogs.map(log => (
            <tr key={log.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3 text-sm">{log.timestamp}</td>
              <td className="px-5 py-3">{log.user}</td>
              <td className="px-5 py-3">{log.action}</td>
              <td className="px-5 py-3"><span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">{log.severity}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMaintenance = () => (
    <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
      <div className="text-6xl mb-4">🔧</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Maintenance Mode</h2>
      <p className="mb-4" style={{ color: colors.textSecondary }}>Currently: <span className="text-green-500">● System Online</span></p>
      <button className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: '#FF4444', color: '#fff' }}>Enable Maintenance Mode</button>
    </div>
  );

  const renderCompliance = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Compliance Status</h2>
      <div className="space-y-3">
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>GDPR Compliance</span><span className="text-green-500">✅ Compliant</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>Data Protection</span><span className="text-green-500">✅ Active</span>
        </div>
        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
          <span>NACTVET Standards</span><span className="text-yellow-500">⚠️ Pending Audit</span>
        </div>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="glass-card overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
      <div className="p-5 border-b flex justify-between" style={{ borderColor: colors.border }}>
        <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>API Keys</h2>
        <button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>+ Generate Key</button>
      </div>
      <table className="w-full">
        <tbody>
          {sampleApiKeys.map(key => (
            <tr key={key.id} className="border-t" style={{ borderColor: colors.border }}>
              <td className="px-5 py-3">{key.name}</td>
              <td className="px-5 py-3">{key.lastUsed}</td>
              <td className="px-5 py-3">{key.requests.toLocaleString()} req</td>
              <td className="text-green-500">● {key.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmailConfig = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Email Configuration</h2>
      <div className="space-y-3">
        <div className="flex justify-between"><span>SMTP Server:</span><span className="font-mono">smtp.gmail.com:587</span></div>
        <div className="flex justify-between"><span>Status:</span><span className="text-green-500">✅ Connected</span></div>
        <div className="flex justify-between"><span>Queue Size:</span><span>124 emails pending</span></div>
      </div>
      <button className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Test Connection</button>
    </div>
  );

  const renderSMSGateway = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>SMS Gateway (Africa's Talking)</h2>
      <div className="space-y-3">
        <div className="flex justify-between"><span>Balance:</span><span className="font-bold">4,230 SMS credits</span></div>
        <div className="flex justify-between"><span>Monthly Usage:</span><span>1,234 SMS ($12.34)</span></div>
        <div className="flex justify-between"><span>Status:</span><span className="text-green-500">✅ Operational</span></div>
      </div>
      <button className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Configure API</button>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>1,250</div>
          <div>Total Users</div>
          <div className="text-xs text-green-500">↑ +12%</div>
        </div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold text-green-500">892</div>
          <div>DAU</div>
          <div className="text-xs text-green-500">↑ +5%</div>
        </div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-2xl font-bold text-blue-500">48</div>
          <div>Courses</div>
          <div className="text-xs text-green-500">↑ +3</div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Generate Reports</h2>
      <div className="space-y-3">
        <button className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>📊 User Activity Report</button>
        <button className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>📚 Course Enrollment Report</button>
        <button className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>📝 Assignment Submissions</button>
      </div>
      <button className="mt-4 w-full px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Export Selected Report</button>
    </div>
  );

  const renderImportExport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Import Data</h2>
        <div className="border-2 border-dashed p-8 text-center rounded-lg" style={{ borderColor: colors.border }}>
          <div className="text-4xl mb-2">📁</div>
          <p>Drag & drop CSV/Excel file here</p>
          <button className="mt-3 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Select File</button>
        </div>
      </div>
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Export Data</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>📥 Export Users (CSV)</button>
          <button className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>📥 Export Courses (Excel)</button>
        </div>
      </div>
    </div>
  );

  // Main render content switch - ALL sections mapped
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard': return renderDashboard();
      case 'user-management': return renderUserManagement();
      case 'manage-users': return renderManageUsers();
      case 'role-assignment': return renderRoleAssignment();
      case 'user-activity': return renderUserActivity();
      case '2fa-enforcement': return render2FA();
      case 'course-management': return renderCourseManagement();
      case 'departments': return renderDepartments();
      case 'academic-calendar': return renderAcademicCalendar();
      case 'announcements': return renderAnnouncements();
      case 'groups-rooms': return renderGroupsRooms();
      case 'notifications': return renderNotifications();
      case 'database-backup': return renderDatabaseBackup();
      case 'file-storage': return renderFileStorage();
      case 'system-health': return renderSystemHealth();
      case 'system-logs': return renderSystemLogs();
      case 'maintenance': return renderMaintenance();
      case 'compliance': return renderCompliance();
      case 'api-keys': return renderAPIKeys();
      case 'email-config': return renderEmailConfig();
      case 'sms-gateway': return renderSMSGateway();
      case 'analytics': return renderAnalytics();
      case 'reports': return renderReports();
      case 'import-export': return renderImportExport();
      default: return renderDashboard();
    }
  };

  // Sidebar menu groups
  const menuGroups = [
    { id: 'main', label: '📊 Main', sections: ['dashboard'] },
    { id: 'user', label: '👥 User Management', sections: ['user-management', 'manage-users', 'role-assignment', 'user-activity', '2fa-enforcement'] },
    { id: 'academic', label: '📚 Academic', sections: ['course-management', 'departments', 'academic-calendar'] },
    { id: 'comm', label: '💬 Communication', sections: ['announcements', 'groups-rooms', 'notifications'] },
    { id: 'system', label: '⚙️ System', sections: ['database-backup', 'file-storage', 'system-health', 'system-logs', 'maintenance'] },
    { id: 'security', label: '🔒 Security', sections: ['compliance', 'api-keys', 'email-config', 'sms-gateway'] },
    { id: 'reporting', label: '📊 Reporting', sections: ['analytics', 'reports', 'import-export'] },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-xl`} style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderRight: `1px solid ${colors.border}` }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          {sidebarOpen ? <h1 className="text-xl font-bold" style={{ color: colors.primary }}>UCC Connect Hub</h1> : <h1 className="text-xl font-bold" style={{ color: colors.primary }}>UC</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: colors.textSecondary }}>☰</button>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍💼</div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Admin User</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>System Administrator</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuGroups.map(group => (
            <div key={group.id} className="mb-4">
              {sidebarOpen && <div className="px-4 py-2 text-xs uppercase tracking-wider" style={{ color: colors.textSecondary }}>{group.label}</div>}
              {group.sections.map(sectionId => (
                <button
                  key={sectionId}
                  onClick={() => setActiveSection(sectionId)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${activeSection === sectionId ? 'font-semibold' : ''}`}
                  style={{ backgroundColor: activeSection === sectionId ? `${colors.primary}15` : 'transparent', color: activeSection === sectionId ? colors.primary : colors.textSecondary }}
                >
                  <span>{sectionIcons[sectionId] || '•'}</span>
                  {sidebarOpen && <span>{sectionTitles[sectionId]}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button className="w-full text-left text-sm p-2 rounded-lg transition-all" style={{ color: colors.textSecondary, backgroundColor: `${colors.primary}10` }}>
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 flex justify-between items-center shadow-sm" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{sectionTitles[activeSection] || 'Admin Dashboard'}</h1>
          <span className="text-sm" style={{ color: colors.textSecondary }}>Welcome back, Admin!</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;