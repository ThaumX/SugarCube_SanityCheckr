# SugarCube_SanityCheckr

A validation tool for twee/twine script in the SugarCube format written in JavaScript to be run with node.js

## Version History

### Version 0.1

**Note:** Work on this tool just started, so it's very limited!
Currently examines .tw passages to make sure that common html tags are closed, and also checks that several default SugarCube macro tags are closed. That's it at the moment, check back for more advanced functionality.

## Purpose

This tool is brand new, and is being produced by me (ThaumX) to help with the development of [Accidental Woman](www.thaumx.com). Because of the mix of HTML and Twee, standard HTML validation tools are largely ineffective. Simple HTML and SugarCube Twine script errors are common but can be time consuming to catch, an issue that grows with the length and complexity of the game. This tool is intended to discover errors in source files such as unclosed macros and html tags. Eventually it will have more thorough functionality as I add to it along with the development of AW.

## Requirements

+ Obviously, **node.js** to run the script.

+ **node-dir** for directory support. [find it here](https://github.com/fshost/node-dir)  **Install:** `npm install node-dir -g`

+ Twine script outside of the Twine application. If you use the Twine app to create your game, you will first need to copy and paste all of the passages into plain text files with the .tw extension. *You can also use an application called tweego to extract the data from your Twine app story archive file.* Be sure to include the standard twee passage headers `:: PassageName [tags]` It's much easier to produce complex games or games with a lot of content *outside* of the Twine app anyway.

## Instructions

It's a bit early for this, but for the sake of those less familiar with node and such:

1. Open up a command prompt / terminal prepared for node.js *Note that node.js install typically adds a launcher to skip the "preparation" step.*

2. Install the dependencies if necessary *node-dir*

3. Navigate to the directory that contains a folder with all your .tw source files. __This folder should be named "src"__ because I haven't added any folder selection/configuration options yet. *The variable to point to a relative directory is near the top of the script, and easily changeable*

4. In your node cmd/terminal, type `node sanityCheckr.js`

5. The results of the check will print to the terminal, allowing you to see any found errors. *Again, this isn't optimized at all, but at least it's fast. Eventually want to output results to a file.*
