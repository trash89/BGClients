const { defineConfig } = require("cypress");
// const execa = require("execa");

// const findBrowser = () => {
//   // the path is hard-coded for simplicity
//   const browserPath = "/usr/bin/brave-browser";

//   return execa(browserPath, ["--version"]).then((result) => {
//     // STDOUT will be like "Brave Browser 77.0.69.135"
//     const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(result.stdout);
//     const majorVersion = parseInt(version.split(".")[0]);

//     return {
//       name: "Brave",
//       channel: "stable",
//       family: "chromium",
//       displayName: "Brave",
//       version,
//       path: browserPath,
//       majorVersion,
//     };
//   });
// };

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // return findBrowser().then((browser) => {
      //   return {
      //     browsers: config.browsers.concat(browser),
      //   };
      // });
    },
    baseUrl: "http://localhost:3000",
  },

  video: false,
  videoUploadOnPasses: false,
  screenshotOnRunFailure: false,
  experimentalStudio: true,
  defaultCommandTimeout: 7000,
  requestTimeout: 7000,
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
