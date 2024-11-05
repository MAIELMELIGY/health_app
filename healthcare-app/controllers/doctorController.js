const Visit = require('../models/visit');
const Treatment = require('../models/treatment');

exports.startVisit = async (req, res) => {
  const { visitId } = req.body;

  try {
    // Check if the doctor already has an active visit
    const activeVisit = await Visit.findOne({
      where: { doctorId: req.user.id, status: 'In Progress' }
    });

    if (activeVisit) {
      return res.status(400).json({ error: 'You already have an active visit' });
    }
    const visit = await Visit.findOne({
      where: { 
        id: parseInt(visitId, 10), 
        doctorId: parseInt(req.user.id, 10), 
        status: 'Pending' 
      }
    });
    
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found or already in progress' });
    }

    visit.status = 'In Progress';
    await visit.save();

    res.json({ message: 'Visit started successfully', visit });
  } catch (error) {
    console.error('Error starting visit:', error);
    res.status(500).json({ error: 'Failed to start visit' });
  }
};

// Add Treatment to Visit
exports.addTreatment = async (req, res) => {
  const { visitId, description, value } = req.body;

  try {
    // Find the visit and ensure it's in progress
    const visit = await Visit.findOne({
      where: { id: visitId, doctorId: req.user.id, status: 'In Progress' }
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found or not in progress' });
    }

    // Add the treatment
    const treatment = await Treatment.create({ visitId, description, value });

    // Update the total amount of the visit
    visit.totalAmount += value;
    await visit.save();

    res.json({ message: 'Treatment added successfully', treatment, totalAmount: visit.totalAmount });
  } catch (error) {
    console.error('Error adding treatment:', error);
    res.status(500).json({ error: 'Failed to add treatment' });
  }
};

// Complete the Visit
exports.completeVisit = async (req, res) => {
  const { visitId } = req.body;

  try {
    const visit = await Visit.findOne({ where: { id: visitId, doctorId: req.user.id, status: 'In Progress' } });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found or not in progress' });
    }

    visit.status = 'Completed';
    await visit.save();

    res.json({ message: 'Visit completed successfully', visit });
  } catch (error) {
    console.error('Error completing visit:', error);
    res.status(500).json({ error: 'Failed to complete visit' });
  }
};