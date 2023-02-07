var events = require('events');

class API {
  constructor(apiParams) {
    const { notifyInErrors, notifyInMs }= apiParams;
    this.notifyInErrors = apiParams.notifyInErrors;
    this.notifyInMs = apiParams.notifyInMs;

    //Create API Events
    this.apiEvents = new events.EventEmitter();

    //Create NotifyService
    new NotifyService(notifyInErrors, notifyInMs, this.apiEvents);
  }

  logError(error) {
    //append to file
    console.log("I append a message to file with error", error);
    //emit error event
    this.apiEvents.emit('error');
  }
}

class NotifyService {
  constructor(inErrors, inTime, eventSuscriber) {
    this.name = 'Notify Service';

    this.inErrors = inErrors;
    this.inTime = inTime;
    this.accumErrorsInMs = 0;
    this.initialize(eventSuscriber);
  }

  initialize(eventSuscriber) {
    this.lastNotificationTime = null;
    this.errorsStack = [];
    eventSuscriber.on('error', this.errorsHandler.bind(this));
  }

  errorsHandler() {
    console.log("New Error");
    const now = new Date();
    
    for (const errTime of this.errorsStack) {
      const diff = Math.abs(now - errTime);
      if (diff >= this.inTime) {
        this.errorsStack.shift()
      } else {
        break;
      }
    }

    const errorsInMs = this.errorsStack.length + 1;
    this.errorsStack.push(now);
    console.log("Errors in Ms", errorsInMs);

    if (errorsInMs >= this.inErrors) {
      if (this.lastNotificationTime == null) {
        this.lastNotificationTime = now;
        console.log("Alarm is triggered");
      } else {
        const diff = Math.abs(now - this.lastNotificationTime);
        if (diff > this.inTime) {
          console.log("Alarm is triggered");
          this.lastNotificationTime = now;
        } else {
          console.log("Alarm already triggered ms ago", diff)
        }
      }
    }
    }
}

function main() {
  const apiParams = {
    notifyInErrors: 10,
    notifyInMs: 60000
  };

  const api = new API(apiParams);

  setInterval(()=> {
    api.logError("New Error");
  }, 1000)

  setTimeout(()=> {
    process.exit();
  }, 90000)
}

main()


