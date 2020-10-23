int sensorPin = 0;

void setup() {
  
  Serial.begin(115200);
  analogReference(INTERNAL);
}

void loop() {
  
  int reading = analogRead(sensorPin);
  float voltage = reading * 1.1;
  voltage /= 1024.0;

  float temperatureC = (voltage - 0.5) * 100;

  Serial.println(temperatureC);

  delay(3000);
}
