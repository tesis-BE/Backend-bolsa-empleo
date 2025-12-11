/**
 * BaseService - Clase base para todos los servicios con operaciones CRUD
 */
class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(where, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (!record) {
      throw new Error('Registro no encontrado');
    }
    return record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);
    if (!record) {
      throw new Error('Registro no encontrado');
    }
    await record.destroy();
    return true;
  }

  async paginate({
    page = 1,
    pageSize = 20,
    where = {},
    include = [],
    order = [['createdAt', 'DESC']],
  }) {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await this.model.findAndCountAll({
      where,
      include,
      order,
      limit: pageSize,
      offset,
    });

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async count(where = {}) {
    return this.model.count({ where });
  }

  async exists(where) {
    const count = await this.model.count({ where });
    return count > 0;
  }
}

module.exports = BaseService;
