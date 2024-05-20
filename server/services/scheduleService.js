const moment = require('moment');
const Schedule = require('../models/Schedule');
const attendeeService = require('../services/attendeeService');
const scheduleReminderService = require('../services/scheduleReminderService');
const Attendee = require('../models/Attendee');
const ScheduleReminder = require('../models/ScheduleReminder');

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
        for (let dateTime = startDate; !dateTime.isAfter(dbRepeatUntilDate); dateTime.add(1, 'days')) {
          let repeatDayOfWeek = parseInt(dateTime.format('d')) + 1;
          if ('0' + repeatDayOfWeek === scheduleData.repeat_day_of_week) {
            scheduleData.schedule_start_date_time = dbStartDate.toDate();
            scheduleData.schedule_end_date_time = dbEndDate.toDate();
            await this.saveDbSchedule(scheduleData);
          }
          dbStartDate = moment(dbStartDate).add(1, 'days');
          dbEndDate = moment(dbEndDate).add(1, 'days');
        }
      } else if (scheduleData.repeat_type === '04') {
        let dayOfMonth = dbStartDate.format('DD');
        let diffInDays = dbEndDate.diff(dbStartDate, 'days');
        let repeatDayOfWeek = parseInt(dbStartDate.format('d'));

        if (scheduleData.repeat_type_of_month === '01') {
          for (let dateTime = startDate; !dateTime.isAfter(dbRepeatUntilDate); dateTime.add(1, 'months')) {
            if (dayOfMonth === dateTime.format('DD')) {
              scheduleData.schedule_start_date_time = dbStartDate.toDate();
              scheduleData.schedule_end_date_time = dbEndDate.toDate();
              await this.saveDbSchedule(scheduleData);
            }
            dbStartDate = moment(dbStartDate).add(1, 'months');
            dbEndDate = moment(dbEndDate).add(1, 'months');
          }
        } else if (scheduleData.repeat_type_of_month === '02') {
          while (!dbStartDate.isAfter(dbRepeatUntilDate)) {
            let firstDayOfMonth = dbStartDate.clone().date(1);
            let firstOccurrence = firstDayOfMonth.day(repeatDayOfWeek);
            if (firstOccurrence.date() > 7) {
              firstOccurrence.add(7, 'days');
            }
            let fourthRepeatDay = firstOccurrence.clone().add(3, 'weeks');

            if (!fourthRepeatDay.isAfter(dbRepeatUntilDate)) {
              dbStartDate = fourthRepeatDay;
              scheduleData.schedule_start_date_time = dbStartDate.toDate();
              dbEndDate = fourthRepeatDay.clone()
                .add(diffInDays, 'days')
                .hour(dbEndDate.hour())
                .minute(dbEndDate.minute())
                .second(dbEndDate.second());
              scheduleData.schedule_end_date_time = dbEndDate.toDate();
              await this.saveDbSchedule(scheduleData);
            }
            dbStartDate = dbStartDate.add(1, 'months');
            dbEndDate = dbEndDate.add(1, 'months');
          }
        } else if (scheduleData.repeat_type_of_month === '03') {
          while (!dbStartDate.isAfter(dbRepeatUntilDate)) {
            let lastDayOfMonth = dbStartDate.clone().endOf('month');
            let lastRepeatDay = lastDayOfMonth.clone();
            while (lastRepeatDay.day() !== repeatDayOfWeek) {
              lastRepeatDay.subtract(1, 'day');
            }
            if (!lastRepeatDay.isAfter(dbRepeatUntilDate)) {
              dbStartDate = lastRepeatDay;
              scheduleData.schedule_start_date_time = dbStartDate.toDate();
              dbEndDate = lastRepeatDay.clone()
                .add(diffInDays, 'days')
                .hour(dbEndDate.hour())
                .minute(dbEndDate.minute())
                .second(dbEndDate.second());
              scheduleData.schedule_end_date_time = dbEndDate.toDate();
              await this.saveDbSchedule(scheduleData);
            }
            dbStartDate = dbStartDate.add(1, 'months');
            dbEndDate = dbEndDate.add(1, 'months');
          }
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

  static async saveDbSchedule(scheduleData) {
    try {
      const scheduleId = await new Promise((resolve, reject) => {
        Schedule.saveSchedule(scheduleData, async (err, scheduleId) => {
          if (err) {
            reject(err);
          } else {
            if (Array.isArray(scheduleData.attendee)) {
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
            }

            if (Array.isArray(scheduleData.attendee) && scheduleData.attendee.length > 0) {
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

  static async updateSchedule(scheduleData) {
    try {
      const dbSchedules = await this.getScheduleByCode(scheduleData.schedule_code);
      for (const schedule of dbSchedules) {
        Attendee.deleteAttendeesByScheduleId(schedule.id);
        ScheduleReminder.deleteScheduleRemindersByScheduleId(schedule.id);
      }
      Schedule.deleteScheduleByCode(scheduleData.schedule_code);

      await this.saveSchedule(scheduleData);

      return scheduleData.schedule_code;
    } catch (error) {
      throw error;
    }
  }

  static async getScheduleById(id) {
    return new Promise((resolve, reject) => {
      Schedule.getScheduleById(id, (err, schedule) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedule);
        }
        Schedule.getScheduleById(id, (err, schedule) => {
          if (err) {
            reject(err);
          } else {
            resolve(schedule);
          }
        });
      });
    });
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
