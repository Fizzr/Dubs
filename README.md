# Dubs
Google Chrome extension to find specific post ID's in a given thread at 4chan.org, mainly dubs, trips and quads.

The extension is soley a content script, i.e. code injected into the DOM of the webpage itself and shown as a part of it.

As of now the UI takes form of a square box in the top right of any thread on 4chan.org. Any result is shown in boxes below the initial box. 

#Installation
-Save the extension in a folder on you computer  
-Open chrome  
-Enter chrome://extensions in the adress bar, or navigate to the extensions tab using the menues.  
-Check "Developer mode"  
-Press "Load unpacked extensions..."  
-Find the extension folder and press OK  
-Make sure the extension is enabled  

#Issues and Bugs
-The design (made by me) is (in my opinion) god awful.  
-Threads with no reply render a transparent background of the extension, as the extension steals its background colour from the reply class.  
-When no results are returned the result containers become tiny boxes that are still visable due to the borders and background.  
- The border doubles between resultContainer and searchContainer  
- The entire .load() situation loading test.html (should change the name) feels like a hack.  

#Features to be added
- Some mechanism of being able to find the next post of given criterea that is below the top of the screen. Alternatively this simply being shown in the list of results, where the screen is at. E.g. if in middle of roll thread, and OP requests number 8, find next 8 post under OP's, so that you don't find the first post on the page again.  
- Nicer UI!  
- Suport for Gentoo  

#Feed the Cancer!