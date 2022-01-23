#!/bin/bash
cd $1
for i in {1..3}
do
  timestamp=$(date +%s)
  wget -O dummy.$timestamp.gif https://www.placecage.com/gif/58$i/48$i
  sleep 1
done
exit
