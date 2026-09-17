#include <Arduino.h>
// motor da esquerda
const int ena_esquerda = 3; // enable
const int in_3 = 4;
const int in_4 = 5;
// motor da direita
const int ena_direita = 6;
const int in_1 = 7;
const int in_2 = 8;

void setup() {
  pinMode(ena_esquerda, OUTPUT);
  pinMode(in_3, OUTPUT);
  pinMode(in_4, OUTPUT);
  pinMode(ena_direita, OUTPUT);
  pinMode(in_1, OUTPUT);
  pinMode(in_2, OUTPUT);
}
void loop() {
  analogWrite(ena_esquerda, 128);
  digitalWrite(in_3, HIGH);
  digitalWrite(in_4, LOW);
  delay(5000);
  analogWrite(ena_esquerda, 0);
  delay(1000);
  digitalWrite(in_3, LOW);
  digitalWrite(in_4, HIGH);
  for (int i = 0; i <= 255; i++) {
    analogWrite(ena_esquerda, i);
    delay(100);
  }
  analogWrite(ena_esquerda, 0);
  delay(300);
}