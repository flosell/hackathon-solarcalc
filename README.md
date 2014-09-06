Overview
========

About
-----

SolarCap is the easiest way to explore your houses solar potential by just selecting the surface on the houses roof on a map.
A new and improved algorithm assures maximal usability of the site and accuracy of the result based on geolocation data, 
sunlight, roof surface, energy consumption and other influencing variables.

The application is aimed at users without any prior solar experience and the easy and clear UX of this one page app advances the overall usage of the page.


Build status
------------

[![Build Status](https://snap-ci.com/flosell/hackathon-solarcalc/branch/master/build_image)](https://snap-ci.com/flosell/hackathon-solarcalc/branch/master)

Integration Environment
-----------------------

- App: http://solarcap.herokuapp.com/
- API: http://solarcap.herokuapp.com/api?area=2000&residents=1&kind=HOME&state=Bavaria&withBattery=true



Development
===========
- update node packages via `npm install`
- start server with `node server.js`
- open `spec/SpecRunner.html` in your browser to run tests