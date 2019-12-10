#ParkingAI

This is a tehnical demo made to show what could be done when useing tehnology to eficently enfore parking rules and detect parking violations useing AI.
The tehnical demo uses a the Bucharest streets as refeance for AI training because parking violations are more frequent so it takes less sample data to train.

##Numberplate format

Full Numer
```
Non Trim
r"[a-z]{1,2}\s[0-9]{2,3}\s[a-z]{3}"gmi

Trim
r"[a-z]{1,2}[0-9]{2,3}[a-z]{3}"gmi
```

Red Numbers
```
Non Trim
r"[a-z]{1,2}[0-9]{3,6}"gmi

Trim

r"[a-z]{1,2}[0-9]{3,6}"gmi
```