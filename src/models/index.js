const User = require('./User');
const Company = require('./Company');
const Job = require('./Job');
const Application = require('./Application');
const Conversation = require('./Conversation');
const Message = require('./Message');
const File = require('./File');
const UserSkill = require('./UserSkill');
const UserPortfolio = require('./UserPortfolio');
const Notification = require('./Notification');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const University = require('./University');
const Faculty = require('./Faculty');

// Definir relaciones
// User -> Company (1 recruiter : 1 company)
Company.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });
User.hasOne(Company, { foreignKey: 'recruiterId', as: 'company' });

// Company -> Job (1:N)
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });

// User -> Job (1 recruiter : N jobs - a través de company)
Job.belongsTo(User, {
  foreignKey: 'companyId',
  sourceKey: 'id',
  as: 'createdByUser',
});

// User -> Application (1:N)
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });

// Job -> Application (1:N)
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

// Application -> Conversation (1:1)
Conversation.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});
Application.hasOne(Conversation, {
  foreignKey: 'applicationId',
  as: 'conversation',
});

// Conversation -> User (many to many virtual)
Conversation.belongsTo(User, { foreignKey: 'graduateId', as: 'graduate' });
Conversation.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

// Conversation -> Message (1:N)
Message.belongsTo(Conversation, {
  foreignKey: 'conversationId',
  as: 'conversation',
});
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });

// Message -> User (quien envía)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });

// User -> File (1:N)
File.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(File, { foreignKey: 'userId', as: 'files' });

// User -> UserSkill (1:N)
UserSkill.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(UserSkill, { foreignKey: 'userId', as: 'skills' });

// User -> UserPortfolio (1:N)
UserPortfolio.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(UserPortfolio, { foreignKey: 'userId', as: 'portfolios' });

// User -> Notification (1:N)
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// User -> Role (N:M)
User.belongsToMany(Role, { through: 'UserRoles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: 'UserRoles', foreignKey: 'roleId' });

// Role -> Permission (N:N)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});

// University -> Faculty (1:N)
Faculty.belongsTo(University, { foreignKey: 'universityId', as: 'university' });
University.hasMany(Faculty, { foreignKey: 'universityId', as: 'faculties' });

module.exports = {
  User,
  Company,
  Job,
  Application,
  Conversation,
  Message,
  File,
  UserSkill,
  UserPortfolio,
  Notification,
  Role,
  Permission,
  RolePermission,
  University,
  Faculty,
};
