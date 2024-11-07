const Visit = require('../models/visit');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.searchVisits = async (req, res) => {
  const { doctorName, patientName, visitId } = req.query;
  const searchConditions = {};
  if (req.user.userType === 'Doctor') {
    searchConditions.doctorId = req.user.id;
  }
  if (req.user.userType === 'Patient') {
    searchConditions.patientId = req.user.id;
  }
  if (visitId) {
    searchConditions.id = visitId;
  }

  if (doctorName) {
    searchConditions['$Doctor.name$'] = { [Op.like]: `%${doctorName}%` };
  }

  if (patientName) {
    searchConditions['$Patient.name$'] = { [Op.like]: `%${patientName}%` };
  }

  try {
    const visits = await Visit.findAll({
      where: searchConditions,
      include: [
        { model: User, as: 'Doctor', attributes: ['name'] },
        { model: User, as: 'Patient', attributes: ['name'] },
      ]
    });

    res.json({ visits });
  } catch (error) {
    console.error('Error searching visits:', error);
    res.status(500).json({ error: 'Failed to search visits' });
  }
};

exports.reviewVisit = async (req, res) => {
  const { visitId } = req.params;

  try {
    const visit = await Visit.findOne({
      where: { id: visitId },
      include: [
        { model: User, as: 'Doctor', attributes: ['name'] },
        { model: User, as: 'Patient', attributes: ['name'] },
        { model: Treatment, attributes: ['description', 'value'] }
      ]
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    res.json({ visit });
  } catch (error) {
    console.error('Error reviewing visit:', error);
    res.status(500).json({ error: 'Failed to review visit' });
  }
};
