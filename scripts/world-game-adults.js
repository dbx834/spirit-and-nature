// ----------------------------------------------------------------------------
// -------------------------------------------------------------------- Imports
// ----------------------------------------------------------------------------
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Libraries
const fs = require("fs");
const moment = require("moment");
const _ = require("lodash");

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------- Data
// ----------------------------------------------------------------------------
const dirName = "world-game-in-sand-for-all";
const years = ["2018"];
const every = ["Friday"];

/** make a dir */
const makeDir = dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir);
      console.log(`Created ${dir}`);
    } catch (e) {
      console.log(`Failed creating ${dir}`);
      console.log(e);
    }
  } else {
    console.log(`${dir} already exists`);
  }
};

// define version of fs.writeFile() that will only write the file
// if the file does not already exist and will do so without
// possibility of race conditions (e.g. atomically)
/** writes a file if it doesn't exist */
fs.writeFileIfNotExist = (fname, contents, options, callback) => {
  if (typeof options === "function") {
    // it appears that it was called without the options argument
    callback = options;
    options = {};
  }
  options = options || {};
  // force wx flag so file will be created only if it does not already exist
  options.flag = "wx";
  fs.writeFile(fname, contents, options, err => {
    var existed = false;
    if (err && err.code === "EEXIST") {
      // This just means the file already existed.  We
      // will not treat that as an error, so kill the error code
      err = null;
      existed = true;
    }
    if (typeof callback === "function") {
      callback(err, existed);
    }
  });
};

const template = `
---
title: World Game in Sand
subTitle: na
cover: fallback
category: 1.World Games
abstract: World Game in Sand for all.
date: %date%
fromTime: 3.00pm
toTime: 4.30pm
type: event
cost: Free
tags:
  - wgAdults
---

World Game session for children, adults or guests. Please contact me to register for a session.

`;

// ----------------------------------------------------------------------------
// ------------------------------------------------------------------ Functions
// ----------------------------------------------------------------------------
// 1. Create 'dirName' if does not exist...
const dir = `./content/events/${dirName}`;
makeDir(dir);

_.map(years, year => {
  const yearDir = `${dir}/${year}`;
  makeDir(yearDir);

  const startDate = moment(`${year}-01-01`);
  const endDate = startDate.clone().endOf("year");
  const duration = Math.round(
    Math.abs(
      parseFloat(moment.duration(startDate.diff(endDate)).as("days"), 10),
    ),
  );

  _.times(duration, addThis => {
    const normalize = addThis + 1;
    const thisDay = startDate.clone().add(normalize, "day");
    const day = thisDay.format("dddd");
    const thisDate = thisDay.format("YYYY-MM-DD");
    const fileName = `${yearDir}/${thisDate}.md`;
    const humanDate = thisDay.format("dddd, MMMM Do YYYY");

    let content = _.replace(template, "%date%", thisDate);
    content = _.replace(content, "%humanDate%", humanDate);
    content = _.trimStart(content);

    _.map(every, everyX => {
      if (day === everyX) {
        fs.writeFileIfNotExist(fileName, content, (err, existed) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`created ${fileName}`);
          }
        });
      }
    });
  });
});
