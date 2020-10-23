import serial
import socket
import json

ser = serial.Serial('/dev/ttyUSB0', 115200)

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(('', 9090))
sock.listen(1)
conn, addr = sock.accept()

print ('connected:', addr)

while True:
	data = ser.readline()
	A = str(data)
	K = list(A)
	if "b" in K:
		K.remove("b")
	if "'" in K:
		K.remove("'")
	if "\\" in K:
		K.remove("\\")
	if "\\" in K:
		K.remove("\\")
	if "r" in K:
		K.remove("r")
	if "n" in K:
		K.remove("n")
	if "'" in K:
		K.remove("'")
	data = "".join(K)
	Data11 = {"id": "prop.tempsensor", "value": data}
	Data12 = json.dumps(Data11)
	DATA = bytes(Data12, 'utf-8')
	conn.send(DATA)