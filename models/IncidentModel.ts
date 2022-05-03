const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Incident = new Schema(
  {
    assignedTo: String,
    createdBy: String,
    description: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Incident || mongoose.model('Incident', Incident);
export default mongoose.models.Incident || mongoose.model('Incident', Incident);
