'use strict'

/**
 * THE LOVE MACHINE
 * written by Ben Redden
 */

const sensorPin = 'A0',
  baselineTemp = 20,
  five = require('johnny-five'),
  board = new five.Board(),
  outputPins = [2, 3, 4],
  _ = require('underscore');

let ledObject = {},
  sensorVal = 0;

board.on('ready', function() {
  // set up the sensor on analog pin 0 (sensorPin)
  const tempSensor = new five.Sensor(sensorPin);

  // set up LEDs on pins 2-4
  _.each(outputPins, function(outputPin) {
    // ledObject[outputPin] = new five.Led(outputPin);
    // // make sure they're off
    // ledObject[outputPin].off();
    board.pinMode(outputPin, five.Pin.OUTPUT); // pin is an output
    board.digitalWrite(outputPin, 0); // they are off
  });

  setTimeout(function(){ // delay to give sensor time to catch up
    // get data from the tempSensor
    tempSensor.on('change', function() {
      sensorVal = this.value;
      // alert the console
      console.log('Sensor Value: ' + sensorVal);

      // Analog to Digital Conversion (ADC) to voltage
      // sensor reports back int in range 0 - 1024, Arduino is 5v
      let voltage = (sensorVal/1024.0) * 5.0;

      // more alerts
      console.log(', Volts: ' + voltage);

      // convert voltage to temp in degrees C
      let temperature = (voltage - .5) * 100;

      // alert again
      console.log(', Temperature degrees C: ' + temperature);

      // light it up
      if (temperature < baselineTemp) {
        board.digitalWrite(2, 0);
        board.digitalWrite(3, 0);
        board.digitalWrite(4, 0); // these are all off
      }
      else if (temperature >= baselineTemp + 2 && temperature < baselineTemp + 4) {
        board.digitalWrite(2, 1); // this is now on
        board.digitalWrite(3, 0); // still off
        board.digitalWrite(4, 0);
      }
      else if (temperature >= baselineTemp + 4 && temperature < baselineTemp + 6) {
        board.digitalWrite(2, 1);
        board.digitalWrite(3, 1); // this is now on
        board.digitalWrite(4, 0); // still off
      }
      else if (temperature >= baselineTemp + 6) {
        board.digitalWrite(2, 1);
        board.digitalWrite(3, 1);
        board.digitalWrite(4, 1); // this is now on
      }
    });
  }, 5000);
});
