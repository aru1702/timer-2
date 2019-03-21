import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //  var-name:var-type = var-value
  //  var-type any means can be anything
  //    (int, real, boolean, etc.)
  //  variable types based on : https://dzone.com/articles/what-are-the-basic-data-types-in-typescript
  
  /**
   *  Some common data types in TypeScript are: number, string, boolean, enum, 
   *  void, null, undefined, any, never, Array and tuple.
   */

  percent:number = 100;
  radius:number = 100; 
  fullTime:any = '00:01:10';
  animDur:any = 1000;
  
  timer:any = false;
  progress:any = 0;

  minutes: number = 1;
  seconds: any = 10;

  elapsed: any = {
    m: '00',
    s: '00'
  }

  myTitle:string = this.elapsed.m + ":" + this.elapsed.s;
  mySubtitle:string = "START";

  overallTimer: any = false;

  //  this constructer prevent the device going to auto lock
  //  or going to sleep
  //  when: the timer is up
  constructor(private insomnia: Insomnia) { 
    
    //this left blank because it automatically from framework

  }

  startTime() {
    
    this.animDur = 10;

    this.printTimer();

    //  this function helps when multiclick doesn't mess up the time
    if (this.timer) {
      clearInterval(this.timer);
    }

    //  if overallTimer still false, run progressTimer function
    if (this.overallTimer == false) {
      this.progressTimer();
      this.insomnia.keepAwake();
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    //  split (":") making the var into array
    let timeSplit = this.fullTime.split(":");
    
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    //  totalSecond = defined minutes * 60 plus by the defined seconds
    //  example: 1 min 30 sec = 60 + 30 = 90 sec
    let totalSecond = Math.floor(this.minutes * 60) + parseInt(this.seconds);

    //  setInterval = method to run functions per milisecond
    //  example:  setInterval (() => { define function }, doing-by-milisekon)
    this.timer = setInterval( () => {

      //  if percent equal to radius, which radius always 100
      //  then stop the time
      if (this.percent >= this.radius) {
        clearInterval(this.timer);
        this.mySubtitle = "FINISH";
      } else {

        this.mySubtitle = "GO!";
      
        //  percent = how many 0 to totalSecond in 100%

        /**
         * i'd like to make the animDur become more progressively
         * using per 100 milisecond or 0.1 second for animation
         * 
         * also i've found that below 0.1 the machine/browser cannot
         * reload faster than that
         */
        this.percent = Math.floor(((this.progress / totalSecond) * 100) / 10);
        this.progress++;

      }

    }, 100)

  }

  progressTimer () {

    //  create new object with Date()
    let countDownDate = new Date();

    this.overallTimer = setInterval( () => {

      //  now = get the machine time every second, object created every second
      //  distance = get the deviation of "now" and "countDownDate"
      //    -> countDownDate saved the time when the object created
      //    -> this perform before "now" being created
      let now = new Date().getTime();
      let distance = now - countDownDate.getTime();

      if (this.percent >= this.radius) {
        clearInterval(this.overallTimer);
      } else {

        this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000  * 60));
        this.elapsed.s = Math.floor((distance % (1000 * 60)) / (1000));

        this.printTimer();

      }

    }, 1000)

  }

  printTimer () {
    
    this.elapsed.m = this.pad(this.elapsed.m, 2);
    this.elapsed.s = this.pad(this.elapsed.s, 2);

    this.myTitle = this.elapsed.m + ":" + this.elapsed.s;
  }

  //  pad function makes the number has leading zero
  //  example:
  //    withour leading 0 = 1, 2, 3, etc.
  //    with leading 0    = 01, 02, 03, etc.
  //
  //  @param num    the number
  //  @param size   the size of number
  //  @return s     the number will be return
  pad (num, size) {
    let s = num + "";
    while (s.length < size){
      s = "0" + s;
    }
    return s;
  }
  
  //  this function when stop button in html page is pressed
  //  it will reset the timer and stop the function
  stopTime() {

    this.mySubtitle = "START";

    clearInterval(this.timer);
    clearInterval(this.overallTimer);

    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    
    this.elapsed = {
      m:'00',
      s:'00'
    }

    this.insomnia.allowSleepAgain();

  }
  
}
