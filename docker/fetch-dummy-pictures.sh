#!/bin/bash
cd $1
for i in {1..10}
do
  timestamp=$(date +%s)
  wget -O dummy.$timestamp.jpg https://source.unsplash.com/random?sig=$timestamp
  sleep 1
done
exit
