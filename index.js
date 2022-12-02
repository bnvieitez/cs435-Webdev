/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

//lets us make calls back to this server from different pages
const cors = require('cors');
const { Octokit } = require('octokit');
const fs = require('fs');

var pullRequestTitle = "";
var pullRequestDiffUrl = "";
var pullRequestNumber = 0;
var parsed_text = ""

module.exports = (app, {getRouter}) => {
  const router = getRouter();
  app.log.info("Yay, the app was loaded!");
  app.on("pull_request.opened", async (context) => {
    pullRequestTitle = context.payload.pull_request.title;
    pullRequestDiffUrl = context.payload.pull_request.diff_url;
    pullRequestNumber = context.payload.number;
    
    console.log(pullRequestTitle);
    console.log(pullRequestDiffUrl);
    console.log(pullRequestNumber);

    // authenticate to octokit to get the difference url
    const octokit = new Octokit({ 
      auth: process.env.PAT_TOKEN,
    });
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner: "WM-SEMERU",
      repo: "csci-435_reviewbot",
      pull_number: pullRequestNumber,
      mediaType: {
        format: "diff",
      },
    });
    // The contents aka the code with the --- and +++ is in the pullRequest variable we will need to perform the cleanup on that
    //console.log("The details of Pull request difference is %s", pullRequest);

    // write the contents of the pullRequest to a file and then send it to the parser and get the parsed
    // text back and console.log it. 
    fs.writeFile('parse_test_hard.txt', pullRequest, (err) => {
      if (err) throw err
      else {
        try {
        var parseFn = require('./parser.js')
        parsed_text = parseFn();
        console.log(parsed_text);
      } catch (error) {
            console.log(error)
        };}
    }); 
    
    router.get("/pull-request-test", cors(), (req, res) => {    
      res.send(parsed_text)
      //res.send(`A new issue named ${pullRequestTitle} was created. The difference URL is ${pullRequestDiffUrl}`);
    });
  });

  //listening for "push" event - may not be necessary for the scopes of this project
  /*
  app.on("push", async (context) => {
    commits = context.payload.commits[0];
    url = commits.url
    modified = commits.modified
    added = commits.added
    removed = commits.removed
    author = commits.author
    var data = {}
    data["modified"] = modified;
    data["added"] = added;
    data["removed"] = removed;
    data["url"] = url;
    data["author"] = author;
    router.get("/push-test", cors(), (req, res) => {
      res.json(data);
    });
  });*/
};