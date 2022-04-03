#!/bin/bash

#PGPASSWORD="${1}" pg_dump -U postgres -p 5432 -Fc -d ${2} > "${3}"

#echo Hello, World!

PGPASSWORD="    " pg_dump -U postgres -p 5432 -Fc -d ${1} > "${2}"