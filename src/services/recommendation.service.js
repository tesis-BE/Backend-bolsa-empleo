const {
  Job,
  User,
  Application,
  SavedJob,
  Company,
  UserSkill,
} = require('../models');
const { Op } = require('sequelize');
const { JOB_STATUS } = require('../config/constants');

class RecommendationService {
  async getRecommendedJobs(userId, page = 1, pageSize = 10) {
    const user = await User.findByPk(userId, {
      include: [
        { model: UserSkill, as: 'skills' },
        { model: Application, as: 'applications' },
      ],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const userSkills = user.skills.map((s) => s.skillName.toLowerCase());
    const appliedJobIds = user.applications.map((a) => a.jobId);

    const jobs = await Job.findAll({
      where: {
        status: JOB_STATUS.PUBLISHED,
        id: { [Op.notIn]: appliedJobIds },
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logoUrl', 'location'],
        },
      ],
    });

    const jobsWithScore = jobs.map((job) => {
      const score = this.calculateMatchScore(user, job, userSkills);
      const reasons = this.getMatchReasons(user, job, userSkills, score);

      return {
        ...job.toJSON(),
        matchScore: score.total,
        matchReasons: reasons,
        skillsMatch: score.skills,
        locationMatch: score.location,
      };
    });

    const sortedJobs = jobsWithScore
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice((page - 1) * pageSize, page * pageSize);

    return {
      data: sortedJobs,
      pagination: {
        total: jobsWithScore.length,
        page,
        pageSize,
        totalPages: Math.ceil(jobsWithScore.length / pageSize),
      },
    };
  }

  calculateMatchScore(user, job, userSkills) {
    const scores = {
      skills: 0,
      faculty: 0,
      experience: 0,
      location: 0,
      total: 0,
    };

    const jobSkills = (job.skills || []).map((s) => s.toLowerCase());

    if (jobSkills.length > 0) {
      const matchingSkills = jobSkills.filter((skill) =>
        userSkills.includes(skill)
      );
      scores.skills = Math.round(
        (matchingSkills.length / jobSkills.length) * 40
      );
    } else {
      scores.skills = 20;
    }

    if (
      job.preferredFaculties &&
      job.preferredFaculties.includes(user.facultyId)
    ) {
      scores.faculty = 30;
    }

    const userExperience = this.calculateUserExperience(user);
    const requiredExperience = this.parseExperienceRequired(
      job.experienceRequired
    );

    if (userExperience >= requiredExperience) {
      scores.experience = 20;
    } else if (userExperience >= requiredExperience - 1) {
      scores.experience = 10;
    }

    if (job.workMode === 'remote') {
      scores.location = 10;
    } else if (user.location && job.location) {
      const userLoc = user.location.toLowerCase();
      const jobLoc = job.location.toLowerCase();
      if (userLoc.includes(jobLoc) || jobLoc.includes(userLoc)) {
        scores.location = 10;
      }
    }

    scores.total =
      scores.skills + scores.faculty + scores.experience + scores.location;

    return scores;
  }

  getMatchReasons(user, job, userSkills, scores) {
    const reasons = [];

    if (scores.skills > 0) {
      const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
      const matchingSkills = jobSkills.filter((skill) =>
        userSkills.includes(skill)
      );
      const percentage = Math.round(
        (matchingSkills.length / jobSkills.length) * 100
      );
      reasons.push(
        `Tienes ${matchingSkills.length} de ${jobSkills.length} habilidades requeridas (${percentage}%)`
      );
    }

    if (scores.faculty === 30) {
      reasons.push('Tu carrera coincide con el perfil buscado');
    }

    if (scores.experience === 20) {
      reasons.push('Cumples con el nivel de experiencia requerido');
    } else if (scores.experience === 10) {
      reasons.push('Tu experiencia está cerca del nivel requerido');
    }

    if (scores.location === 10) {
      if (job.workMode === 'remote') {
        reasons.push('La posición es 100% remota');
      } else {
        reasons.push('La ubicación es conveniente para ti');
      }
    }

    if (reasons.length === 0) {
      reasons.push('Esta oferta podría ser una buena oportunidad');
    }

    return reasons;
  }

  calculateUserExperience(user) {
    return 0;
  }

  parseExperienceRequired(experienceStr) {
    if (!experienceStr) return 0;

    const match = experienceStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async getSimilarJobs(jobId, limit = 5) {
    const job = await Job.findByPk(jobId);

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    const similarJobs = await Job.findAll({
      where: {
        status: JOB_STATUS.PUBLISHED,
        id: { [Op.ne]: jobId },
        [Op.or]: [
          { companyId: job.companyId },
          { jobType: job.jobType },
          { location: { [Op.iLike]: `%${job.location}%` } },
        ],
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logoUrl', 'location'],
        },
      ],
      limit,
    });

    return similarJobs;
  }
}

module.exports = new RecommendationService();
