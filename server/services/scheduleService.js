const Schedule = require('../models/Schedule');
const attendeeService = require('../services/attendeeService');
const scheduleReminderService = require('../services/scheduleReminderService');
const moment = require('moment');
const differenceInDays = require('date-fns');

class ScheduleService {
  static async getAllSchedules(req) {
    return new Promise((resolve, reject) => {
      const selData = {
        user_code: req.cookies.userCode,
        group_code: req.cookies.groupCode
      };
      Schedule.getAll(selData, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }

  static async getScheduleByIds(req) {
    return new Promise((resolve, reject) => {
      req = req.query.ids;
      Schedule.getScheduleByIds(req, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }

  static async getAllAttendeesBySchedule(id) {
    return new Promise((resolve, reject) => {
      Schedule.getAllAttendeesBySchedule(id, (err, attendees) => {
        if (err) {
          reject(err);
        } else {
          resolve(attendees);
        }
      });
    });
  }

  static async saveSchedule(scheduleData) {
    try {
      const user_code = await this.getScheduleCode();
      scheduleData.schedule_code = user_code;
      scheduleData.created_at = new Date();
      scheduleData.updated_at = new Date();

      let startDate = moment(scheduleData.schedule_start_date_time);
      let dbStartDate = moment(scheduleData.schedule_start_date_time);
      let dbEndDate = moment(scheduleData.schedule_end_date_time);
      let dbRepeatUntilDate = moment(scheduleData.repeat_until);
      if (scheduleData.repeat_until !== null) {
        scheduleData.repeat_until = moment(scheduleData.repeat_until).toDate();
      }

      if (scheduleData.repeat_type === '01') {
        scheduleData.repeat_until = null;
        scheduleData.repeat_day_of_week = null;
        scheduleData.repeat_type_of_month = null;
        scheduleData.schedule_start_date_time = dbStartDate.toDate();
        scheduleData.schedule_end_date_time = dbEndDate.toDate();
        await this.saveDbSchedule(scheduleData);
      } else if (scheduleData.repeat_type === '02') {
        scheduleData.repeat_day_of_week = null;
        scheduleData.repeat_type_of_month = null;
        for (let dateTime = startDate; !dateTime.isAfter(dbRepeatUntilDate); dateTime.add(1, 'days')) {
          if (dateTime !== dbStartDate) {
            dbStartDate = moment(dbStartDate).add(1, 'days');
            dbEndDate = moment(dbEndDate).add(1, 'days');
          }
          scheduleData.schedule_start_date_time = dbStartDate.toDate();
          scheduleData.schedule_end_date_time = dbEndDate.toDate();
          await this.saveDbSchedule(scheduleData);
        }
      } else if (scheduleData.repeat_type === '03') {
        scheduleData.repeat_type_of_month = null;

        console.log(scheduleData.repeat_day_of_week);
        const targetDayOfWeek = this.getDayOfWeek(scheduleData.repeat_day_of_week);
        console.log(targetDayOfWeek);
        let diffDays = this.diffDay(dbStartDate, dbEndDate);
        console.log(diffDays);
        while (startDate.isBefore(dbRepeatUntilDate) || startDate.isSame(dbRepeatUntilDate)) {
          if (this.getDayOfWeek(startDate) === targetDayOfWeek) {
            console.log(this.getDayOfWeek(startDate));
            console.log(dbStartDate);
            console.log(dbEndDate);
            dbStartDate = startDate;
            console.log('dbStartDate.toDate().getDate()');
            console.log(dbStartDate.toDate().getDate());
            const temEndDate = new Date(dbEndDate);
            temEndDate.setDate(dbStartDate.toDate().getDate() + (diffDays-1));
            dbEndDate = moment(temEndDate);
            console.log('complete');
            console.log(dbStartDate);
            console.log(dbEndDate);

            scheduleData.schedule_start_date_time = dbStartDate.toDate();
            scheduleData.schedule_end_date_time = dbEndDate.toDate();
            await this.saveDbSchedule(scheduleData);
          }
          startDate = moment(startDate).add(1, 'months');
        }
      } else if (scheduleData.repeat_type === '05') {
        scheduleData.repeat_day_of_week = null;
        scheduleData.repeat_type_of_month = null;
        for (let dateTime = startDate; !dateTime.isAfter(dbRepeatUntilDate); dateTime.add(1, 'years')) {
          if (!dateTime.isSame(dbStartDate)) {
            dbStartDate = moment(dbStartDate).add(1, 'years');
            dbEndDate = moment(dbEndDate).add(1, 'years');
          }
          scheduleData.schedule_start_date_time = dbStartDate.toDate();
          scheduleData.schedule_end_date_time = dbEndDate.toDate();
          await this.saveDbSchedule(scheduleData);
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  }

  static diffDay(startDateTime, endDateTime) {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  static getDayOfWeek(repeatDayOfWeek) {
    let dayOfWeek = 7; // Default to Sunday (0)

    // Mapping day names to numerical representations
    const dayMappings = {
      'MON': 1,
      'TUE': 2,
      'WED': 3,
      'THU': 4,
      'FRI': 5,
      'SAT': 6,
      'SUN': 7,
    };

    if (dayMappings.hasOwnProperty(repeatDayOfWeek)) {
      dayOfWeek = dayMappings[repeatDayOfWeek];
    }

    return dayOfWeek;
  }

  static async saveDbSchedule(scheduleData) {
    try {
      const scheduleId = await new Promise((resolve, reject) => {
        Schedule.saveSchedule(scheduleData, async (err, scheduleId) => {
          if (err) {
            reject(err);
          } else {
            if (!scheduleData.allday_flg && scheduleData.schedule_reminder.length > 0) {
              for (const scheduleReminder of scheduleData.schedule_reminder) {
                scheduleReminder.schedule_id = scheduleId.insertId;
                scheduleReminder.del_flg = false;
                scheduleReminder.created_by = scheduleData.created_by;
                scheduleReminder.created_at = new Date();
                scheduleReminder.updated_by = scheduleData.updated_by;
                scheduleReminder.updated_at = new Date();
                await scheduleReminderService.saveScheduleReminder(scheduleReminder);
              }
            }

            if (scheduleData.attendee.length > 0) {
              for (const att of scheduleData.attendee) {
                att.schedule_id = scheduleId.insertId;
                att.response_time = new Date();
                att.response_status_flg = true;
                att.del_flg = false;
                att.created_by = scheduleData.created_by;
                att.created_at = new Date();
                att.updated_by = scheduleData.updated_by;
                att.updated_at = new Date();
                await attendeeService.saveAttendee(att);
              }
            }
            resolve(scheduleId);
          }
        });
      });
      return scheduleId; // Return the scheduleId
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  }

  static async deleteScheduleOne(scheduleId, userCode) {
    try {
      const delData = {
        id: scheduleId,
        del_flg: true,
        updated_by: userCode,
        updated_at: new Date()
      };
      await attendeeService.deleteAttendees(delData);
      await scheduleReminderService.deleteScheduleReminders(delData);
      await Schedule.deleteSchedule(delData);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteScheduleAll(scheduleCode, userCode) {
    try {
      const dbSchedules = await this.getScheduleByCode(scheduleCode);
      for (const schedule of dbSchedules) {
        const delData = {
          id: schedule.id,
          del_flg: true,
          updated_by: userCode,
          updated_at: new Date()
        };
        const dbAttendees = await attendeeService.getAttendeeByScheduleId(schedule.id);
        if (dbAttendees.length > 0) {
          await attendeeService.deleteAttendees(delData);
        }
        const dbScheduleReminders = await scheduleReminderService.getScheduleReminderByScheduleId(schedule.id);
        if (dbScheduleReminders.length > 0) {
          await scheduleReminderService.deleteScheduleReminders(delData);
        }
        await Schedule.deleteSchedule(delData);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }


  static async getScheduleByCode(schedule_code) {
    return new Promise((resolve, reject) => {
      Schedule.getScheduleByCode(schedule_code, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }

  static async getScheduleCode() {
    try {
      const scheduleData = await new Promise((resolve, reject) => {
        Schedule.getScheduleCode((err, scheduleData) => {
          if (err) {
            reject(err);
          } else {
            resolve(scheduleData);
          }
        });
      });

      let schedule_code = "S000001";;
      if (scheduleData != null && scheduleData.length > 0) {
        const nextNumber = parseInt(scheduleData[0].schedule_code.substring(1)) + 1;
        schedule_code = "S" + nextNumber.toString().padStart(6, '0');
      }
      return schedule_code;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ScheduleService;
