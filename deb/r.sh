#!/bin/bash

dpkg-scanpackages amd64 | gzip -9c > amd64/Packages.gz
dpkg-scanpackages amd64 | bzip2 > amd64/Packages.bz2
dpkg-scanpackages amd64 > amd64/Packages
