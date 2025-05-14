const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [1, 'Amount must be at least 1']
  },
  reward: {
    title: String,
    description: String,
    amount: Number
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  backer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate pledges from same user on same project
pledgeSchema.index({ project: 1, backer: 1 }, { unique: true });

// Static method to get total amount raised for a project
pledgeSchema.statics.getTotalRaised = async function(projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId, status: { $ne: 'cancelled' } }
    },
    {
      $group: {
        _id: '$project',
        amountRaised: { $sum: '$amount' }
      }
    }
  ]);

  try {
    await this.model('Project').findByIdAndUpdate(projectId, {
      amountRaised: obj[0] ? obj[0].amountRaised : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getTotalRaised after save
pledgeSchema.post('save', function() {
  this.constructor.getTotalRaised(this.project);
});

// Call getTotalRaised after remove
pledgeSchema.post('remove', function() {
  this.constructor.getTotalRaised(this.project);
});

module.exports = mongoose.model('Pledge', pledgeSchema);
