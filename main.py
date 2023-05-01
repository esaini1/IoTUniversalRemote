import RPi.GPIO as GPIO
# use Raspberry Pi board pin numbers
GPIO.setmode(GPIO.BCM)

import time
import signal
import sys
import time
import board
import neopixel
import drivers
from time import sleep

from flask import Flask,render_template,Response
import cv2

device = ""
state = ""
server_ip_address = "192.168.86.37"
port = 80
timeoutCounter = 0

def close(signal, frame):
    GPIO.cleanup() 
    sys.exit(0)
signal.signal(signal.SIGINT, close)


while True:

    time.sleep(0.00001)
    startTime = time.time()
    stopTime = time.time()
    while 0 == GPIO.input(pinEchoDistance):
        startTime = time.time()
    while 1 == GPIO.input(pinEchoDistance):
        stopTime = time.time()

    if (payload >=30):
        timeoutCounter = 0
        status = "ON  "
    elif (payload < 30) and (payload >= 14):
        Led[ledNode] = (0, 255, 0)
        timeoutCounter = 0
        status = "OFF    "
    elif (payload < 14) and (payload >= 7):
        Led[ledNode] = (255, 255, 0)
        timeoutCounter = 0
        status = "COLOR           "
    elif (payload < 7) and (payload >= 2):
        Led[ledNode] = (255, 0, 0)
        timeoutCounter = 0
        status = "LUX            "
    elif (payload < 2) and (payload >= -10):
        status = "TEMP        "
        if (timeoutCounter < 100):
            Led.fill((255, 0, 0))
            timeoutCounter += 1
    elif (payload < -10):
        timeoutCounter = 0
        status = "QTY        "

    time.sleep(0.1)


    async def put_light(state):
    context = await aiocoap.Context.create_client_context()
    request = aiocoap.Message(
        code=aiocoap.PUT,
        uri='coap://<server_ip_address>/light',
        payload=state.encode('utf-8')
    )
    response = await context.request(request).response
    print(f'Response: {response.payload.decode()}')
    state = 'on’
    asyncio.run(put_light(state))

state = payload.lower()
    if state == 'on':
        await zigate.write_attribute(light_device, 0x0006, 0x0100, 0x01)
    elif state == 'off':
        await zigate.write_attribute(light_device, 0x0006, 0x0100, 0x00)
    else:
        print(f'Invalid state: {state}')


app=Flask(__name__)

def generate_frames():
    camera=cv2.VideoCapture(0)
    while True:
            
        ## read the camera frame
        success,frame=camera.read()
        if not success:
            break
        else:
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()

        yield(b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def camindex():
    return render_template('camindex.html')

@app.route('/video')
def video():
    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__=="__main__":
    app.run(host='0.0.0.0',port=5001, debug=False)
