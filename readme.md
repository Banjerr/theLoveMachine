# theLoveMachine

![pic!](https://github.com/Banjerr/theLoveMachine/blob/master/theLoveMachine.gif)

This is another simple project from the Arduino starter kit. Coded first with native C/C++ and then converting that over to JavaScript utilizing the Johnny-Five lib.

## original Arduino (C/C++) code

```c
/**
 * THE LOVE MACHINE
 * written by Ben Redden
 */

const int sensorPin = A0;
const float baselineTemp = 23.4;

void setup() {
  Serial.begin(9600); // open a serial port at 9600 bits per second

  // loop through all the pins with LEDs attached
  for (int pinNumber = 2; pinNumber < 5; pinNumber++) {
    pinMode(pinNumber, OUTPUT); // this is an output pin
    digitalWrite(pinNumber, LOW); // this is now off
  }
}

void loop() {
  int sensorVal = analogRead(sensorPin); // get the voltage on the pin and save to a val

  // send data back to the serial monitor in the IDE
  Serial.print("Sensor Value: ");
  Serial.print(sensorVal);

  // Analog to Digital Conversion (ADC) to voltage
  // sensor reports back int in range 0 - 1024, Arduino is 5v
  float voltage = (sensorVal/1024.0) * 5.0;

  Serial.print(", Volts: ");
  Serial.print(voltage);

  // convert the voltage to temp in degrees
  Serial.print(", degrees C: ");
  float temperature = (voltage - .5) * 100;
  Serial.println(temperature);

  // light it up
  if (temperature < baselineTemp) {
    digitalWrite(2, LOW);
    digitalWrite(3, LOW);
    digitalWrite(4, LOW); // these are all off
  }
  else if (temperature >= baselineTemp+2 && temperature < baselineTemp+4) {
    digitalWrite(2, HIGH); // this is now on
    digitalWrite(3, LOW); // still off
    digitalWrite(4, LOW);
  }
  else if (temperature >= baselineTemp+4 && temperature < baselineTemp+6) {
    digitalWrite(2, HIGH);
    digitalWrite(3, HIGH); // this is now on
    digitalWrite(4, LOW); // still off
  }
  else if (temperature >= baselineTemp+6) {
    digitalWrite(2, HIGH);
    digitalWrite(3, HIGH);
    digitalWrite(4, HIGH); // this is now on
  }

  delay(1); // ADC can only read so fast, delay at end of loop
}
```

## Johnny-Five JavaScript (with some Underscore.js too)

```javascript
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

```
