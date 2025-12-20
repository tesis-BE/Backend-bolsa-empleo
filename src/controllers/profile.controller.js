const BaseController = require('./base.controller');
const profileService = require('../services/profile.service');

class ProfileController extends BaseController {
  constructor() {
    super(profileService);
  }

  async getCompleteProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await profileService.getCompleteProfile(userId);

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
