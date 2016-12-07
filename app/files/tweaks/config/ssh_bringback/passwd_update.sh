#!/bin/sh
export PATH=$PATH:/tmp
mkdir /config-mfg
mount -t squashfs  /dev/mtdblock5 /config-mfg
/tmp/config-update.sh --start

#if grep '^root:' /config-mfg/passwd ; then
    # passwd needs updating
    cp /tmp/passwd /tmp/configtmp/passwd
    # authorized_keys needs to be added
    cp /tmp/authorized_keys /tmp/configtmp/authorized_keys
    
#else
#    cp /tmp/authorized_keys /tmp/configtmp/authorized_keys
#fi
/tmp/config-update.sh --commit
