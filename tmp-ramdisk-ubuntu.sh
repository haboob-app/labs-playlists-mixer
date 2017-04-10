#!/bin/sh
apphome="`cd \`dirname $0\` && pwd && cd - >/dev/null`"
tmpdir="${apphome}/tmp"

rm -r tmp/ > /dev/null 2>&1
mkdir $tmpdir
umount $tmpdir > /dev/null 2>&1
mount -t tmpfs -o size=512m tmpfs $tmpdir
