const {Page, ui, ScrollView} = require('tabris');
const BigToolbar = require('../widgets/BigToolbar');
const cellBackgroundGenerator = require('../globalFunctions/appointmentCellBackgroundGenerator');
const colors = require('../appSettings/colors');

const toolbarHeight = '170';

class appointmentDetailsPage extends Page{
  constructor(appointment, index) {
    super(Object.assign({title: ''}));
    this.appointment = appointment;
    this.index = index;
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');
    this.title = this._generateTitle(index);
    this.subTitle = this._generateSubTitle(appointment);
    this._generateUI();
    this.on("disappear", () => {
      this._rootNavigationView.set('toolbarVisible', true);
    });
    this._generateInfo();
  }

  _generateUI(){
    let background;
    if(this.appointment.cancelled === true || this.appointment.moved === true){
      firebase.Analytics.logEvent('open_appointmentdetailspage', {screen: 'appointmentdetailscreen', appointment: 'changed'});
      background = cellBackgroundGenerator(this.appointment, this.index);
    }else{
      firebase.Analytics.logEvent('open_appointmentdetailspage', {screen: 'appointmentdetailscreen', appointment: 'default'});
      background = colors.UI_bg
    }

    this._rootNavigationView.set('toolbarVisible', false);
    this._toolbar = new BigToolbar({
      top: 0,
      left: 0,
      right: 0,
      height: toolbarHeight
    }, this.title, this.subTitle, background).appendTo(this);
  }

  _generateTitle(index){
    let appointmentDay, appointmentHour, appointmentHourSuffix;
    switch (index % 5){
      case 0:
        appointmentDay = 'Maandag';
        break;
      case 1:
        appointmentDay = 'Dinsdag';
        break;
      case 2:
        appointmentDay = 'Woensdag';
        break;
      case 3:
        appointmentDay = 'Donderdag';
        break;
      case 4:
        appointmentDay = 'Vrijdag';
    }
    appointmentHour = Math.ceil(index / 5);
    appointmentHour = appointmentDay === 'Maandag' ? appointmentHour + 1 : appointmentHour;
    appointmentHourSuffix = [1,8].includes(appointmentHour)  ? 'ste' : 'de';
    return `${appointmentDay}, ${appointmentHour}${appointmentHourSuffix} uur`
  }

  _generateSubTitle(appointment){
    let startDate = new Date(appointment.start * 1000);
    let startTime = `${startDate.getHours()}:${startDate.getMinutes()}`;
    let endDate = new Date(appointment.end * 1000);
    let endTime = `${endDate.getHours()}:${endDate.getMinutes()}`;
    return `${startTime} - ${endTime}`
  }

  _generateInfo(){
    this._infoContainer =  new ScrollView({
      top: 170, bottom: 0, left: 0, right: 0
    })

  }
}

module.exports = (index, appointment, rootNavigationView) => {
  let appointmentsDetailsPage = new appointmentDetailsPage(appointment, index).appendTo(rootNavigationView);
};
