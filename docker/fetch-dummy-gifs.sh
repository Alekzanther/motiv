#!/bin/bash
cd $1
for i in {1..3}
do
  timestamp=$(date +%s)
  wget -O dummy.$timestamp.gif https://www.placecage.com/gif/640/480
  sleep 1
done
exit
