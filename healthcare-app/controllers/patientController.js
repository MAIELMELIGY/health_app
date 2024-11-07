const Visit = require('../models/visit');
const User = require('../models/user');


exports.bookVisit = async (req, res) => {
  const { doctorId, preferredTime } = req.body;
  const patientId = req.user.id; 

  try {
    if (typeof doctorId !== 'number') {
      return res.status(400).json({ message: 'Invalid doctorId. Must be an integer.' });
    }

    const newVisit = await Visit.create({
      patientId,
      doctorId,
      preferredTime,
      status: 'Pending',
      totalAmount: 0
    });

    res.status(201).json(newVisit);
  } catch (error) {
    console.error('Error booking visit:', error);
    res.status(500).json({ error: 'Failed to book visit' });
  }
};

exports.viewVisits = async (req, res) => {
  const patientId = req.user.id;

  try {
    const visits = await Visit.findAll({
      where: { patientId },
      include: [
        { model: User, as: 'Doctor', attributes: ['name'] }
      ]
    });
    res.json(visits);
  } catch (error) {
    console.error('Error retrieving visits:', error);
    res.status(500).json({ error: 'Failed to retrieve visits' });
  }
};
exports.listDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { userType: 'Doctor' },
      attributes: ['id', 'name', 'email'] 
    });

    res.json(doctors);
  } catch (error) {
    console.error('Error retrieving doctors:', error);
    res.status(500).json({ error: 'Failed to retrieve doctors' });
  }
};