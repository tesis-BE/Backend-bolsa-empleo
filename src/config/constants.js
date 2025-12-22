module.exports = {
  // User Types
  USER_TYPES: {
    GRADUATE: 'graduate',
    RECRUITER: 'recruiter',
    ADMIN: 'admin',
  },

  // Company Status
  COMPANY_STATUS: {
    PENDING: 'pendiente',
    ACTIVE: 'activo',
    INACTIVE: 'inactivo',
    REJECTED: 'rechazado',
  },

  // Job Status (español)
  JOB_STATUS: {
    DRAFT: 'borrador',
    PUBLISHED: 'publicado',
    CLOSED: 'cerrado',
    PAUSED: 'pausado',
    EXPIRED: 'expirado',
  },

  // Job Types
  JOB_TYPES: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    TEMPORARY: 'temporary',
  },

  // Work Modes
  WORK_MODES: {
    REMOTE: 'remote',
    ON_SITE: 'on-site',
    HYBRID: 'hybrid',
  },

  // Application Status (español)
  APPLICATION_STATUS: {
    PENDING: 'pendiente',
    REVIEWED: 'revisado',
    INTERVIEWED: 'entrevistado',
    ACCEPTED: 'aceptado',
    REJECTED: 'rechazado',
  },

  // File Types
  FILE_TYPES: {
    CV: 'cv',
    PHOTO: 'photo',
    LOGO: 'logo',
    ATTACHMENT: 'attachment',
  },

  // Proficiency Levels
  PROFICIENCY_LEVELS: {
    BEGINNER: 'principiante',
    INTERMEDIATE: 'intermedio',
    ADVANCED: 'avanzado',
    EXPERT: 'experto',
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  },

  // Event Types
  EVENT_TYPES: {
    NEW_APPLICATION: 'new_application',
    APPLICATION_REVIEWED: 'application_reviewed',
    APPLICATION_REJECTED: 'application_rejected',
    MESSAGE_RECEIVED: 'message_received',
    JOB_CLOSED: 'job_closed',
    JOB_PUBLISHED: 'job_published',
    COMPANY_CREATED: 'company_created',
    INTERVIEW_SCHEDULED: 'interview_scheduled',
  },

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // File Upload
  MAX_FILE_SIZE: 10485760, // 10MB
  MAX_PORTFOLIO_LINKS: 5,
  MAX_SKILLS: 50,
};
