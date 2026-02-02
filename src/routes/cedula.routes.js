const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/buscar/:cedula', async (req, res) => {
  try {
    const { cedula } = req.params;

    if (!cedula || cedula.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'La cédula debe tener 10 dígitos',
      });
    }

    const response = await axios.get(
      `https://api.uleamconecta.com/api/cedula/buscar/${cedula}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al consultar la cédula',
    });
  }
});

module.exports = router;
