const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Please add a funding goal'],
    min: [1, 'Funding goal must be at least 1']
  },
  amountRaised: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Arts',
      'Comics',
      'Crafts',
      'Dance',
      'Design',
      'Fashion',
      'Film & Video',
      'Food',
      'Games',
      'Journalism',
      'Music',
      'Photography',
      'Publishing',
      'Technology',
      'Theater'
    ]
  },
  images: [{
    type: String,
    required: [true, 'Please add at least one image']
  }],
  video: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  rewards: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    deliveryDate: {
      type: Date,
      required: true
    },
    quantity: {
      type: Number,
      default: null
    }
  }],
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'funding', 'completed', 'cancelled'],
    default: 'draft'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  risks: {
    type: String,
    maxlength: [1000, 'Risks cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
projectSchema.virtual('backers', {
  ref: 'Pledge',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

// Cascade delete pledges when a project is deleted
projectSchema.pre('remove', async function(next) {
  await this.model('Pledge').deleteMany({ project: this._id });
  next();
});

module.exports = mongoose.model('Project', projectSchema);
