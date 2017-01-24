#!/usr/bin/python

import serial
import re
import urllib2

# Return the serial output of our Arduino
def getSerialOutput():
    ser = serial.Serial('/dev/ttyUSB0', 9600)
    line = ser.readline()
    ser.close()

    regex = re.compile(r'[^\d.]+')
    return regex.sub('', line);

# Send the scale data to our DB
def uploadData(weight):
    apiKey = '******'
    response = urllib2.urlopen('http://tilleytap.com/php/updateOnTap.php?weight=' + weight + '&apiKey=' + apiKey)
    print 'response: ', response.read()
    return;

output = getSerialOutput()
uploadData(output)
