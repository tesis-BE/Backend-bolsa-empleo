const BaseController = require('./base.controller');
const searchService = require('../services/search.service');

class SearchController extends BaseController {
  constructor() {
    super(searchService);
  }

  async advancedSearch(req, res, next) {
    try {
      const result = await searchService.advancedSearch(req.query);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async fullTextSearch(req, res, next) {
    try {
      const { query, page = 1, pageSize = 20 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro query es requerido',
        });
      }

      const result = await searchService.fullTextSearch(
        query,
        parseInt(page),
        parseInt(pageSize)
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async matchSkills(req, res, next) {
    try {
      const {
        skills,
        minMatchPercentage = 70,
        page = 1,
        pageSize = 20,
      } = req.body;

      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro skills debe ser un array',
        });
      }

      const result = await searchService.matchSkills(
        skills,
        parseInt(minMatchPercentage),
        parseInt(page),
        parseInt(pageSize)
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
