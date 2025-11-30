#include <Wire.h>
#include <I2Cdev.h>
#include <MPU6050.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ===== MPU6050 =====
MPU6050 mpu(0x68);
float angleY=0, angleZ=0, angleY_zero=0, angleZ_zero=0;
const float gyroY_offset=76.35, gyroZ_offset=27.96, GYRO_SENS=16.4;
unsigned long lastSampleTime=0;

// ===== FLEX =====
const int flexPin=34;
int flexBaseline=-1;
const float maxFlexAngle=90.0;
const int bendThreshold=100;

// ===== THRESHOLDS =====
float flex_min=0, flex_max=0;
float gyroY_min=0, gyroY_max=0;
float gyroZ_min=0, gyroZ_max=0;
bool thresholdsSet=false;

// ===== MOTORS =====
const int vibMotorPin=32;
#define PWMA 25
#define AIN1 18
#define AIN2 19
#define PWMB 14
#define BIN1 26
#define BIN2 27
#define STBY 23

// ===== BLE =====
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
BLECharacteristic *pCharacteristic;
bool clientConnected=false;

// ===== Posture state =====
bool inBadPosture=false;
unsigned long badPostureStart=0;
bool vibStageActive=false;

// ===== BLE Callbacks =====
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pChar) {
    String value = pChar->getValue().c_str();
    if(value.length()>0){
      if(sscanf(value.c_str(), "%f,%f,%f,%f,%f,%f",
                &flex_min,&flex_max,&gyroY_min,&gyroY_max,&gyroZ_min,&gyroZ_max)==6){
        // Fix: use gyroY_min as gyroZ_min
        gyroZ_min = gyroY_min;
        thresholdsSet=true;
        Serial.printf("Flex:[%.1f,%.1f] GyroY:[%.1f,%.1f] GyroZ:[%.1f,%.1f]\n",
                      flex_min,flex_max,gyroY_min,gyroY_max,gyroZ_min,gyroZ_max);
      } else {
        Serial.println("⚠️ Failed parsing thresholds!");
      }
    }
  }
};

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer){clientConnected=true; Serial.println("📡 App connected");}
  void onDisconnect(BLEServer* pServer){clientConnected=false; Serial.println("📴 App disconnected");}
};

// ===== Helpers =====
float mapFlexToAngle(int v){int d=abs(v-flexBaseline); return min((float)d*(maxFlexAngle/bendThreshold), maxFlexAngle);}
float smooth(float n,float p,float f=0.9){return f*p+(1-f)*n;}
void runMotorA(){digitalWrite(AIN1,HIGH); digitalWrite(AIN2,LOW); digitalWrite(PWMA,HIGH);}
void runMotorB(){digitalWrite(BIN1,HIGH); digitalWrite(BIN2,LOW); digitalWrite(PWMB,HIGH);}
void stopMotors(){digitalWrite(PWMA,LOW); digitalWrite(PWMB,LOW);}
void runVibrationMotor(){digitalWrite(BIN1,HIGH); digitalWrite(BIN2,LOW); digitalWrite(PWMB,HIGH);}
void stopVibrationMotor(){digitalWrite(PWMB,LOW);}

// ===== Setup =====
void setup() {
  Serial.begin(115200);

  BLEDevice::init("AI-GYB");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ|BLECharacteristic::PROPERTY_WRITE|BLECharacteristic::PROPERTY_NOTIFY);
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start(); pServer->getAdvertising()->start();
  Serial.println("📡 BLE ready");

  Wire.begin(21,22); mpu.initialize(); Serial.printf("📟 WHO_AM_I=0x%X\n",mpu.getDeviceID());

  flexBaseline=analogRead(flexPin);
  Serial.printf("📏 Flex baseline=%d\n",flexBaseline);

  long sumY=0,sumZ=0;
  for(int i=0;i<100;i++){
    int16_t ax,ay,az; mpu.getAcceleration(&ax,&ay,&az);
    sumY += atan2(-ax,sqrt(ay*ay+az*az))*180/PI;
    sumZ += atan2(ay,ax)*180/PI;
    delay(10);
  }
  angleY_zero=sumY/100.0; angleZ_zero=sumZ/100.0;

  pinMode(PWMA,OUTPUT); pinMode(AIN1,OUTPUT); pinMode(AIN2,OUTPUT);
  pinMode(PWMB,OUTPUT); pinMode(BIN1,OUTPUT); pinMode(BIN2,OUTPUT);
  pinMode(STBY,OUTPUT); digitalWrite(STBY,HIGH);
  pinMode(vibMotorPin,OUTPUT); digitalWrite(vibMotorPin,LOW);

  Serial.println("✅ System ready. Waiting for app thresholds...");
}

// ===== Loop =====
void loop() {
  if(!clientConnected || !thresholdsSet){delay(100); return;}

  unsigned long now=millis();
  float dt=(now-lastSampleTime)/1000.0; lastSampleTime=now;

  // ==== Sensor Readings ====
  int16_t gx,gy,gz,ax,ay,az;
  mpu.getRotation(&gx,&gy,&gz);
  mpu.getAcceleration(&ax,&ay,&az);
  float gy_dps=(gy-gyroY_offset)/GYRO_SENS;
  float gz_dps=(gz-gyroZ_offset)/GYRO_SENS;
  float accelY=atan2(-ax,sqrt(ay*ay+az*az))*180/PI - angleY_zero;
  float accelZ=atan2(ay,ax)*180/PI - angleZ_zero;

  angleY = smooth(0.9*(angleY+gy_dps*dt)+(1-0.9)*accelY, accelY, 0.95);
  angleZ = smooth(0.85*(angleZ+gz_dps*dt)+(1-0.85)*accelZ, accelZ, 0.98);
  if(angleY<0) angleY=0; if(abs(angleZ)<1) angleZ=0;

  float flexAngle=mapFlexToAngle(analogRead(flexPin));

  Serial.printf("Flex: %.2f | GyroY: %.2f | GyroZ: %.2f\n",flexAngle,angleY,angleZ);

  

  // ==== Posture Detection ====
  bool badPosture=false;
  if(flexAngle > flex_max) badPosture=true;
  if(angleY > gyroY_max)  badPosture=true;
  if(angleZ < gyroZ_min)  badPosture=true;
  if(angleZ > gyroZ_max)  badPosture=true;

  // ==== Posture Alert Logic ====
  String stage = "0";
  if(badPosture) {
    if(!inBadPosture) {
      inBadPosture=true;
      badPostureStart=now;
      vibStageActive=true;
      Serial.println("⚠️ Stage 1: vibration only");
    }

    if(vibStageActive && (now - badPostureStart < 5000)) {
      stage = "1";
      digitalWrite(vibMotorPin,HIGH);
      runVibrationMotor();
      stopMotors();
    } else {
      stage = "2";
      vibStageActive=false;
      digitalWrite(vibMotorPin,HIGH);
      runVibrationMotor();
      runMotorA();
      runMotorB();
      Serial.println("⚠️ Stage 2: vibration + motors");
    }

  } else {
    inBadPosture=false;
    vibStageActive=false;
    digitalWrite(vibMotorPin,LOW);
    stopMotors();
    stopVibrationMotor();
  }

  unsigned long espNow = millis();
  char buf[70];
  snprintf(buf, sizeof(buf), "%.2f,%.2f,%.2f,%s,%lu", 
          flexAngle, angleY, angleZ, stage.c_str(), espNow);
  pCharacteristic->setValue(buf);
  pCharacteristic->notify();

  delay(100);
}
