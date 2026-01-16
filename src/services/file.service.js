const BaseService = require('./base.service');
const { File, User, Company } = require('../models');
const fs = require('fs');
const path = require('path');
const { FILE_TYPES } = require('../config/constants');

class FileService extends BaseService {
  constructor() {
    super(File);
  }

  async saveFile(userId, file, type, entityId = null, entityType = null) {
    const fileData = {
      userId,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      type,
      entityId,
      entityType,
    };

    const savedFile = await File.create(fileData);

    // Si es foto de perfil o CV, actualizar el usuario
    if (type === FILE_TYPES.PHOTO && entityType === 'user') {
      await User.update(
        { photoUrl: `/uploads/photos/${file.filename}` },
        { where: { id: userId } }
      );
    } else if (type === FILE_TYPES.CV && entityType === 'user') {
      await User.update(
        { cvUrl: `/uploads/cvs/${file.filename}` },
        { where: { id: userId } }
      );
    } else if (type === FILE_TYPES.LOGO && entityType === 'company') {
      await Company.update(
        { logoUrl: `/uploads/logos/${file.filename}` },
        { where: { id: entityId } }
      );
    }

    return savedFile;
  }

  async deleteFile(fileId, userId) {
    const file = await File.findByPk(fileId);

    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    if (file.userId !== userId) {
      throw new Error('No tienes permiso para eliminar este archivo');
    }

    // Eliminar archivo físico
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    // Eliminar registro de base de datos
    await file.destroy();

    return true;
  }

  async getByUser(userId) {
    return this.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async getByEntity(entityType, entityId) {
    return this.findAll({
      where: { entityType, entityId },
      order: [['createdAt', 'DESC']],
    });
  }

  async getFilePath(fileId) {
    const file = await File.findByPk(fileId);

    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    if (!fs.existsSync(file.path)) {
      throw new Error('Archivo no encontrado en el sistema');
    }

    return {
      path: file.path,
      filename: file.originalName,
      mimetype: file.mimetype,
    };
  }

  async updateUserPhoto(userId, file) {
    // Eliminar foto anterior si existe
    const existingPhoto = await File.findOne({
      where: { userId, type: FILE_TYPES.PHOTO, entityType: 'user' },
    });

    if (existingPhoto) {
      await this.deleteFile(existingPhoto.id, userId);
    }

    return this.saveFile(userId, file, FILE_TYPES.PHOTO, userId, 'user');
  }

  async updateUserCV(userId, file) {
    // Eliminar CV anterior si existe
    const existingCV = await File.findOne({
      where: { userId, type: FILE_TYPES.CV, entityType: 'user' },
    });

    if (existingCV) {
      await this.deleteFile(existingCV.id, userId);
    }

    return this.saveFile(userId, file, FILE_TYPES.CV, userId, 'user');
  }

  async updateCompanyLogo(companyId, recruiterId, file) {
    const company = await Company.findByPk(companyId);

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const user = await User.findByPk(recruiterId);
    if (!user || user.companyId !== companyId) {
      throw new Error(
        'No tienes permiso para actualizar el logo de esta empresa'
      );
    }

    const existingLogo = await File.findOne({
      where: {
        entityType: 'company',
        entityId: companyId,
        type: FILE_TYPES.LOGO,
      },
    });

    if (existingLogo) {
      await this.deleteFile(existingLogo.id, recruiterId);
    }

    return this.saveFile(
      recruiterId,
      file,
      FILE_TYPES.LOGO,
      companyId,
      'company'
    );
  }
}

module.exports = new FileService();
