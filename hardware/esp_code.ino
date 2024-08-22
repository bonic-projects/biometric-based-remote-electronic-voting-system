//Keypad
#include <Keypad.h>
const byte ROWS = 4;
const byte COLS = 3;
char keys[ROWS][COLS] = { 
    {'1', '2', '3'},
    {'4', '5', '6'},
    {'7', '8', '9'},
    {'*', '0', '#'}};
byte rowPins[ROWS] = {4, 27, 26, 5}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {18, 19, 23}; //connect to the column pinouts of the keypad
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
char enteredPassword[5];
const char *password = "1234";
char keyIn[1];

//Fingerprint sensor
#include <Adafruit_Fingerprint.h>
#define mySerial Serial2
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
int fingerCount = 0;
int fingerID;
int confidenece;
int enrolStatus = 0;

//Display
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 20, 4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

//WiFi
#define wifiLedPin 2

//Firebase
#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>
/* 1. Define the WiFi credentials */
#define WIFI_SSID "Autobonics_4G"
#define WIFI_PASSWORD "autobonics@27"
// For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino
/* 2. Define the API Key */
#define API_KEY "AIzaSyDDWNZ6N3Mka2lgbsPCXMWkVOmqdyQSlSs"
/* 3. Define the RTDB URL */
#define DATABASE_URL "https://biometric-based-voting-default-rtdb.asia-southeast1.firebasedatabase.app/"
/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "device1@autobonics.com"
#define USER_PASSWORD "12345678"
// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0;
// Variable to save USER UID
String uid;
//Databse
String path;

//States
bool isEnrollment = false;
int fingerIdIn = 0;
String line1 = "";
String line2 = "";
String line3 = "";
String line4 = "";

FirebaseData stream;
void streamCallback(StreamData data)
{
  Serial.println("NEW DATA!");

  String p = data.dataPath();

  Serial.println(p);
  printResult(data); // see addons/RTDBHelper.h

  FirebaseJson jVal = data.jsonObject();
  FirebaseJsonData isEnrollmentFB;
  FirebaseJsonData fingerIdInFB;
  FirebaseJsonData line1FB;
  FirebaseJsonData line2FB;
  FirebaseJsonData line3FB;
  FirebaseJsonData line4FB;

  jVal.get(isEnrollmentFB, "isEnrollment");
  jVal.get(fingerIdInFB, "fingerIdIn");
  jVal.get(line1FB, "line1");
  jVal.get(line2FB, "line2");
  jVal.get(line3FB, "line3");
  jVal.get(line4FB, "line4");

  if (isEnrollmentFB.success)
  {
    Serial.println("Success data isEnrollmentFB");
    bool value = isEnrollmentFB.to<bool>(); 
    isEnrollment = value;
  }
   if (fingerIdInFB.success)
  {
    Serial.println("Success data fingerIdInFB");
    int value = fingerIdInFB.to<int>(); 
    fingerIdIn = value;
    Serial.println(value);
    Serial.println(fingerIdIn);
  }
   if (line1FB.success)
  {
    Serial.println("Success data line1FB");
    String value = line1FB.to<String>(); 
    line1 = value;
    lcd.clear(); 
    lcd.setCursor(0, 0);
    lcd.print(line1);
    lcd.setCursor(0, 1);
    lcd.print(line2);
    lcd.setCursor(0, 2);
    lcd.print(line3);
    lcd.setCursor(0, 3);
    lcd.print(line4);
  }
   if (line2FB.success)
  {
    Serial.println("Success data line2FB");
    String value = line2FB.to<String>(); 
    line2 = value;
    lcd.clear(); 
    lcd.setCursor(0, 0);
    lcd.print(line1);
    lcd.setCursor(0, 1);
    lcd.print(line2);
    lcd.setCursor(0, 2);
    lcd.print(line3);
    lcd.setCursor(0, 3);
    lcd.print(line4);
  }
   if (line3FB.success)
  {
    Serial.println("Success data line2FB");
    String value = line3FB.to<String>(); 
    line3 = value;
    lcd.clear(); 
    lcd.setCursor(0, 0);
    lcd.print(line1);
    lcd.setCursor(0, 1);
    lcd.print(line2);
    lcd.setCursor(0, 2);
    lcd.print(line3);
    lcd.setCursor(0, 3);
    lcd.print(line4);
  }
   if (line4FB.success)
  {
    Serial.println("Success data line2FB");
    String value = line4FB.to<String>(); 
    line4 = value;
    lcd.clear(); 
    lcd.setCursor(0, 0);
    lcd.print(line1);
    lcd.setCursor(0, 1);
    lcd.print(line2);
    lcd.setCursor(0, 2);
    lcd.print(line3);
    lcd.setCursor(0, 3);
    lcd.print(line4);
  }
}

void streamTimeoutCallback(bool timeout)
{
  if (timeout)
    Serial.println("stream timed out, resuming...\n");

  if (!stream.httpConnected())
    Serial.printf("error code: %d, reason: %s\n\n", stream.httpCode(), stream.errorReason().c_str());
}




void setup() {  
  Serial.begin(115200);
  delay(100);
  Serial.println("\n\nABFS Starting..");

  //Display
  lcd.init();
  lcd.backlight();
  lcd.clear(); 
  lcd.setCursor(0, 0);
  lcd.print("Hello, Welcome to");
  lcd.setCursor(0, 1);
  lcd.print("Biometric voting");
  lcd.setCursor(0, 2);
  lcd.print("Connecting wifi..");
  lcd.setCursor(0, 3);
  lcd.print("Wait..");

  //WIFI
  pinMode(wifiLedPin, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  unsigned long ms = millis();
  while (WiFi.status() != WL_CONNECTED)
  {
    digitalWrite(wifiLedPin, LOW);
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  digitalWrite(wifiLedPin, HIGH);
  Serial.println(WiFi.localIP());
  Serial.println();
  lcd.setCursor(0, 2);
  lcd.print("Wifi connected");
  lcd.setCursor(0, 3);
  lcd.print("Connecting databse..");

  //FIREBASE
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);

  // Comment or pass false value when WiFi reconnection will control by your code or third party library
  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);

  config.timeout.serverResponse = 10 * 1000;

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  lcd.setCursor(0, 3);
  lcd.print("Connected to databse");
  delay(1000);

  path = "devices/" + uid + "/reading";

   //Stream setup
  if (!Firebase.beginStream(stream, "devices/" + uid + "/data"))
    Serial.printf("sream begin error, %s\n\n", stream.errorReason().c_str());

  Firebase.setStreamCallback(stream, streamCallback, streamTimeoutCallback);

  //Fingerprint sensor
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
    fingerCount = finger.templateCount;
    printDisplay(countString);
    delay(1000);
  }
}

void updateData(bool isUpdate = false){
  if (Firebase.ready() && (isUpdate || (millis() - sendDataPrevMillis > 3000 || sendDataPrevMillis == 0)))
  {
    sendDataPrevMillis = millis();
    FirebaseJson json;
    json.set("keyIn", keyIn);
    json.set("fingerID", fingerID);
    json.set("confidenece", confidenece);
    json.set("fingerCount", fingerCount);
    json.set("enrolStatus", enrolStatus);
    json.set(F("ts/.sv"), F("timestamp"));
    Serial.printf("Set json... %s\n", Firebase.RTDB.set(&fbdo, path.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
    Serial.println("");
  }
}

void loop() {
  if(!isEnrollment) {
    int id = getFingerprintIDez();
    if(id != fingerID) {
      updateData(true);
      fingerID = id;
    }
  }
  else {
    enrollFinger();
  }
  readKeypad();
  updateData();
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
  confidenece = finger.confidence;
  Serial.println(finger.confidence);
  return finger.fingerID;
}

void readKeypad(){
  char key = keypad.getKey();
  if (key != NO_KEY && key != keyIn[0])
  {
    keyIn[0] = key;
    Serial.print(keyIn);
    updateData(true);
  }
}


void printDisplay(String value) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Status");
  lcd.setCursor(0, 1);
  lcd.print(value);
}

void enrollFinger() {
  Serial.println("Ready to enroll a fingerprint!");
  printStats("Ready to  enroll ID:");
  if (fingerIdIn != 0) {// ID #0 not allowed, try again!
    Serial.print("Enrolling ID #");
    Serial.println(fingerIdIn);
    int s = getFingerprintEnroll();
    printStats(String(s));    
    enrolStatus = s;
    while (! s );
  }
}

uint8_t getFingerprintEnroll() {

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(fingerIdIn);
  printStats("Ready to  enroll ID:");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  Serial.println("Remove finger");
  printStats("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(fingerIdIn);
  p = -1;
  Serial.println("Place same finger again");
  printStats("Place same finger");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  Serial.print("Creating model for #");  Serial.println(fingerIdIn);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID "); Serial.println(fingerIdIn);
  p = finger.storeModel(fingerIdIn);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
    printStats("Finger stored");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  return true;
}

void printStats(String value) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Status:");
  lcd.setCursor(0, 1);
  lcd.print(value);
}