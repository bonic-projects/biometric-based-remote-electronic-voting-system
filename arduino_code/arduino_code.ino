//Fingerprint sensor
#include <Adafruit_Fingerprint.h>
#define mySerial Serial2
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

//OLED
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 20, 4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

//Wifi indicator led
#define wifiLed 2

//WIFI
#include <Arduino.h>
#include <WiFi.h>
// Insert your network credentials
#define WIFI_SSID "Autobonics_4G"
#define WIFI_PASSWORD "autobonics@27"

//Firebase
#include <FirebaseESP32.h>
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"
// Insert Firebase project API Key
#define API_KEY "AIzaSyDDWNZ6N3Mka2lgbsPCXMWkVOmqdyQSlSs"

/* 3. Define the user Email and password that already registerd or added in your project */
#define USER_EMAIL "device1@autobonics.com"
#define USER_PASSWORD "12345678"
// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://biometric-based-voting-default-rtdb.asia-southeast1.firebasedatabase.app/"
//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(9600);
  delay(100);
  Serial.println("\n\nABFS Starting..");

  //Display
  lcd.init();
  lcd.backlight();
  lcd.clear(); 
  lcd.setCursor(0, 0);
  lcd.print("Hello, Welcome to");
  lcd.setCursor(2, 0);
  lcd.print("Biometric voting");
  // lcd.setCursor(0, 2);
  // lcd.print("By");
  // lcd.setCursor(2, 3);
  // lcd.print("Team");

  pinMode(wifiLed, OUTPUT);
  digitalWrite(wifiLed, LOW);

  //WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  printDisplay("Connecting WIFI...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  digitalWrite(wifiLed, HIGH);
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  /* Assign the api key (required) */
  config.api_key = API_KEY;
  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;
  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Fingerprint sensor
  // set the data rate for the sensor serial port
  finger.begin(57600);
  delay(5);

  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
    printDisplay("Sensor Ready");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }

  finger.getTemplateCount();

  if (finger.templateCount == 0) {
    Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
  } else {
    Serial.println("Waiting for valid finger...");
    Serial.print("Sensor contains ");
    Serial.print(finger.templateCount);
    Serial.println(" templates");
    String countString = "Fingers: ";
    countString += finger.templateCount;
    printDisplay(countString);
    delay(1000);
  }
}



int fingerID;
unsigned long lastSeenSetMillis = 0;
String fStatus = "";

void loop() {
  if (Firebase.ready()) {
    fingerID = getFingerprintIDez();
    //Firebase
    String uid = auth.token.uid.c_str();  //uid of the device

    if (fingerID == -2) {
      printDisplay("User not enrolled");
      //Firebase
      sendLastSeenAndStatusTofirebase(uid, "User not enrolled");
    } else if (fingerID != -1) {
      // RGB led
      printDisplay("Getting user");

      //Firebase
      sendAttendanceTofirebase(uid, fingerID);
      String nameOfId = getNameFromFId(uid, fingerID);

      //Display`
      nameDisplay(nameOfId);
      Serial.println(nameOfId);

      //Firebase
      sendLastSeenAndStatusTofirebase(uid, "User verified");

      delay(1000);
    } else {
      // RGB led
      printDisplay("Waiting.");
      //Firebase
      sendLastSeenAndStatusTofirebase(uid, "Waiting for user");
    }
    delay(50);
  } else {
    printDisplay("Not connected to server");
  }
}

void sendAttendanceTofirebase(String uid, int value) {
  String path = "/attendance/";
  path += uid;

  String timestampPath = path;
  path += "/id";
  timestampPath += "/time";
  // Write an Int number on the database path test/int
  if (Firebase.RTDB.setInt(&fbdo, path, value) && Firebase.RTDB.setTimestamp(&fbdo, timestampPath)) {
    Serial.println("PASSED");
    Serial.println("PATH: " + fbdo.dataPath());
    Serial.println("TYPE: " + fbdo.dataType());
  } else {
    Serial.println("FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
}

void sendLastSeenAndStatusTofirebase(String uid, String value) {
  if (value != fStatus || (millis() - lastSeenSetMillis > 60000 || lastSeenSetMillis == 0)) {

    fStatus = value;
    lastSeenSetMillis = millis();

    String path = "/biometricScanners/";
    path += uid;
    String timestampPath = path;
    path += "/status";
    timestampPath += "/lastSeen";
    // Write an Int number on the database path test/int
    if ((value == "" || Firebase.RTDB.setString(&fbdo, path, value)) && Firebase.RTDB.setTimestamp(&fbdo, timestampPath)) {
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    } else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_NOTFOUND) return -2;
  if (p != FINGERPRINT_OK) return -1;

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);
  return finger.fingerID;
}

String getNameFromFId(String uid, int fingerID) {
  String path = "/biometricScanners/";
  path += uid;o
  path += "/data/";
  path += fingerID;

  if (Firebase.RTDB.getString(&fbdo, path)) {
    Serial.println("PATH: " + fbdo.dataPath());
    return fbdo.to<const char *>();
  } else {
    Serial.println("PATH: " + fbdo.dataPath());
    Serial.println(fbdo.errorReason());
    return "Error";
  }
}

void printDisplay(String value) {
  lcd.clear();
  lcd.setCursor(3, 0);
  lcd.print("Status");
  lcd.setCursor(2, 1);
  lcd.print(value);
}

void nameDisplay(String value) {
  lcd.clear();
  lcd.setCursor(3, 0);
  lcd.print("Hello, Welcome to");
  lcd.setCursor(2, 1);
  lcd.print(value);
}
