#!/bin/bash
PGPASSWORD="${1}" pg_dump -U postgres ${2} > "${3}"