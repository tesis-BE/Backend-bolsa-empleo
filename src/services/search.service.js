const {
  Job,
  Company,
  User,
  Application,
  SavedJob,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');
const { JOB_STATUS } = require('../config/constants');

class SearchService {
  async advancedSearch({
    page = 1,
    pageSize = 20,
    title,
    type,
    mode,
    minSalary,
    maxSalary,
    skills,
    location,
    companyId,
    facultyId,
    experienceLevel,
    postedWithin,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
  }) {
    const where = { status: JOB_STATUS.PUBLISHED };
    const offset = (page - 1) * pageSize;

    if (title) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${title}%` } },
        { description: { [Op.iLike]: `%${title}%` } },
      ];
    }

    if (type) {
      where.jobType = type;
    }

    if (mode) {
      where.workMode = mode;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (minSalary) {
      where.salaryMax = { [Op.gte]: minSalary };
    }

    if (maxSalary) {
      where.salaryMin = { [Op.lte]: maxSalary };
    }

    if (skills && skills.length > 0) {
      where.skills = { [Op.overlap]: skills };
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (experienceLevel) {
      where.experienceRequired = experienceLevel;
    }

    if (postedWithin) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(postedWithin));
      where.createdAt = { [Op.gte]: daysAgo };
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logoUrl', 'location', 'industry'],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: pageSize,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async fullTextSearch(query, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await Job.findAndCountAll({
      where: {
        status: JOB_STATUS.PUBLISHED,
        [Op.or]: [
          sequelize.literal(
            `to_tsvector('spanish', title || ' ' || description) @@ plainto_tsquery('spanish', '${query}')`
          ),
        ],
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logoUrl', 'location'],
        },
      ],
      limit: pageSize,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async matchSkills(
    userSkills,
    minMatchPercentage = 70,
    page = 1,
    pageSize = 20
  ) {
    const offset = (page - 1) * pageSize;

    const jobs = await Job.findAll({
      where: { status: JOB_STATUS.PUBLISHED },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'logoUrl', 'location'],
        },
      ],
    });

    const jobsWithMatch = jobs
      .map((job) => {
        const jobSkills = job.skills || [];
        const matchingSkills = jobSkills.filter((skill) =>
          userSkills.some(
            (userSkill) => userSkill.toLowerCase() === skill.toLowerCase()
          )
        );

        const matchPercentage =
          jobSkills.length > 0
            ? Math.round((matchingSkills.length / jobSkills.length) * 100)
            : 0;

        return {
          ...job.toJSON(),
          matchPercentage,
          matchingSkills,
        };
      })
      .filter((job) => job.matchPercentage >= minMatchPercentage)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    const total = jobsWithMatch.length;
    const paginatedJobs = jobsWithMatch.slice(offset, offset + pageSize);

    return {
      data: paginatedJobs,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

module.exports = new SearchService();
