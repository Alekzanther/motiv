#!/bin/bash
cd $1
for i in {1..10}
do
  wget -O dummy.$i.jpg https://source.unsplash.com/random?sig=100
  sleep 1
done
