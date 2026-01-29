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
const SavedJob = require('./SavedJob');
const Interview = require('./Interview');
const WorkExperience = require('./WorkExperience');
const Education = require('./Education');
const Certification = require('./Certification');
const Project = require('./Project');

// Definir relaciones
// Company -> User (1 company owner: recruiterId, N members via User.companyId)
Company.belongsTo(User, { foreignKey: 'recruiterId', as: 'owner' });
User.hasOne(Company, { foreignKey: 'recruiterId', as: 'ownedCompany' });

// User -> Company (N:1 - múltiples reclutadores por empresa)
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(User, { foreignKey: 'companyId', as: 'recruiters' });

// Company -> Job (1:N)
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });

// Job -> User (recruiter que creó la oferta)
Job.belongsTo(User, { foreignKey: 'createdBy', as: 'recruiter' });
User.hasMany(Job, { foreignKey: 'createdBy', as: 'createdJobs' });

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

// User -> Faculty (N:1) - graduados pertenecen a una facultad
User.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'faculty' });
Faculty.hasMany(User, { foreignKey: 'facultyId', as: 'graduates' });

// Education -> Faculty (N:1)
Education.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'faculty' });
Faculty.hasMany(Education, { foreignKey: 'facultyId', as: 'educations' });

User.hasMany(SavedJob, { foreignKey: 'userId', as: 'savedJobs' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'savedBy' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Application.hasOne(Interview, { foreignKey: 'applicationId', as: 'interview' });
Interview.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});

User.hasMany(WorkExperience, { foreignKey: 'userId', as: 'workExperiences' });
WorkExperience.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Education, { foreignKey: 'userId', as: 'educations' });
Education.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Certification, { foreignKey: 'userId', as: 'certifications' });
Certification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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
  SavedJob,
  Interview,
  WorkExperience,
  Education,
  Certification,
  Project,
};
