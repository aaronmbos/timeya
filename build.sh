# clean the dist folder
rm -r dist/*
# compile the js
npx babel src/js --out-file dist/js/app.js
# move css
cp -R src/styles dist/styles
#move html
cp src/index.html dist