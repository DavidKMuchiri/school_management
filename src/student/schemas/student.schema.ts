import * as mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    date: {
      type: String,
      required: true
    },
    present: {
      type: Boolean,
      required: true
    }
  });

export const StudentSchema = new mongoose.Schema({
    firstName : String,

    middleName: String,

    lastName: String,

    class: String,

    classTeacher: String,

    studentID: Number,

    attendance: [attendanceSchema]

})

