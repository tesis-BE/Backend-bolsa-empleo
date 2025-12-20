const { Certification } = require('../models');
const BaseService = require('./base.service');

class CertificationService extends BaseService {
  constructor() {
    super(Certification);
  }

  async getUserCertifications(userId) {
    return await Certification.findAll({
      where: { userId },
      order: [['issueDate', 'DESC']],
    });
  }

  async createCertification(userId, data) {
    return await Certification.create({
      userId,
      ...data,
    });
  }

  async updateCertification(certificationId, userId, data) {
    const certification = await Certification.findOne({
      where: { id: certificationId, userId },
    });

    if (!certification) {
      throw new Error('Certificación no encontrada');
    }

    await certification.update(data);
    return certification;
  }

  async deleteCertification(certificationId, userId) {
    const certification = await Certification.findOne({
      where: { id: certificationId, userId },
    });

    if (!certification) {
      throw new Error('Certificación no encontrada');
    }

    await certification.destroy();
    return true;
  }
}

module.exports = new CertificationService();
