#!bin/bash

OUTDIR="$@/_config"
INDIR="$@/config"
mkdir -p ${OUTDIR}

for infile in $INDIR/*; do
  tmpfile=${infile}.tmp
  outfile=${OUTDIR}/`basename ${infile}`
  echo "Templating ${infile} and saving as ${outfile}"
  sed "s/{{ .Env.\([a-zA-Z0-9_-]*\) }}/\${\1}/" < ${infile} | sed 's/"/\\"/g' > ${tmpfile}
  eval "echo \"$(cat ${tmpfile})\"" > $outfile
  rm ${tmpfile}
  echo ""
  echo "----------------"
  cat $outfile
  echo "----------------"
  echo ""
done

rm -rf $INDIR
