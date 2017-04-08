/**
 * Support module for automated UI tests for ALMighty
 * 
 * Ref: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
 * 
 * @author ldimaggi
 */

module.exports = {

/**
 * Set the browser window size
 * 
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667 (note: tests on chrome+firefox fail unless width >= 400)
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 */
  setBrowserMode: function(browserModeStr) {
    switch (browserModeStr) {
	  case 'phone':
	    browser.driver.manage().window().setSize(430, 667);
      break;
	  case 'tablet':
        browser.driver.manage().window().setSize(768, 1024);
      break;
      case 'desktop':
        browser.driver.manage().window().setSize(1920, 1080);
    } 
  },

/**
 * Set the windows in which the tests will run 
 */
  setTestSpace: function (page) {
    page.clickOnSpaceDropdown();
    page.selectSpaceDropDownValue("1");
  },

  /** 
  * Write screenshot to file 
  * Example usage:
  *    browser.takeScreenshot().then(function (png) {
  *      testSupport.writeScreenShot(png, 'exception.png');
  *  });
  * 
  * Ref: http://blog.ng-book.com/taking-screenshots-with-protractor/
  */ 
  writeScreenShot: function(data, filename) {
    var fs = require('fs');
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  },

/*
 * Custom wait function - determine if ANY text appears in a field's value
 */
waitForText: function (elementFinder) {
    return elementFinder.getAttribute("value").then(function(text) {
//      console.log("text = " + text);
      return text !== "";  // could also be replaced with "return !!text;"
    });
  },

/*
 * Create fixed length string - used to generate large strings
 */
generateString: function (size, newlines) {
  var sourceString128 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()\|;:',./<>?`~Ω≈ç√∫˜µ≤≥÷åß∂ƒ©˙∆˚¬…æœ∑´®†¥¨ˆøπ¡™£¢∞§¶•ªº–≠";
  var retString = "";
  var counter = size / 128;
  if (counter < 1) {
    counter = 1;
  } 
  for (var i = 0; i < counter; i++) {
    retString += sourceString128;
    if (newlines) {
      retString += "\n";
    }
  }
  // console.log ("return string ="  + retString);
  return retString;
}


};
