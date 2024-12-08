import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Basic symptom checking endpoint
router.post('/check', authenticateToken, async (req, res) => {
  const { symptoms, duration, severity } = req.body;

  // This is a simplified symptom checker logic
  // In a production environment, this would use a more sophisticated algorithm
  // and a comprehensive medical database
  const possibleConditions = analyzeSymptoms(symptoms, duration, severity);
  
  res.json({
    conditions: possibleConditions,
    disclaimer: 'This is not a medical diagnosis. Please consult with a healthcare professional.'
  });
});

function analyzeSymptoms(symptoms, duration, severity) {
  // Simplified condition matching logic
  const conditions = [];
  
  if (symptoms.includes('fever') && symptoms.includes('cough')) {
    conditions.push({
      name: 'Common Cold',
      description: 'A viral infection of the upper respiratory tract.',
      urgency: 'low'
    });
  }

  if (symptoms.includes('headache') && symptoms.includes('fatigue')) {
    conditions.push({
      name: 'Tension Headache',
      description: 'A common type of headache that can be caused by stress or muscle tension.',
      urgency: 'low'
    });
  }

  if (symptoms.includes('shortness_of_breath')) {
    conditions.push({
      name: 'Respiratory Issue',
      description: 'Could be related to various conditions. Immediate medical attention recommended.',
      urgency: 'high'
    });
  }

  // Add a general recommendation if no specific conditions are matched
  if (conditions.length === 0) {
    conditions.push({
      name: 'Unspecified Condition',
      description: 'Based on your symptoms, we recommend consulting with a healthcare provider for proper evaluation.',
      urgency: 'medium'
    });
  }

  return conditions;
}

export default router;