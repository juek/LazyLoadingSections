# Lazy Loading Sections for Typesetter CMS #

## About
Content of sections that have the CSS class &lsquo;lazy-loading-section&rsquo; (applied via Section Attributes) will be rendered as a *&bull;&bull;&bull;*&nbsp;placeholder which will be dynamically replaced with the actual content not until the section appears on-screen. This way, visitors will get a &lsquo;fast first render&rsquo; and save bandwidth if they do not scroll. 

* Sections need do be *edited and saved after* the CSS class is applied. 
* The Lazy Loading effect will only take place for logged-off users. 
* Works basically with all section types *except* wrapper sections.
* Visitors need to have JavaScript enabled.'

## Current Version 
1.0-b2

See also [Typesetter Home](http://www.typesettercms.com), [Typesetter on GitHub](https://github.com/Typesetter/Typesetter)

## Requirements ##
* Typesetter CMS 5.0+

## Manual Installation ##
1. Download the [master ZIP Archive](https://github.com/juek/LazyLoadingSections/archive/master.zip)
2. Upload the extracted folder 'LazyLoadingSections-master' to your server into the /addons directory
3. Install using Typesetter's Admin Toolbox &rarr; Plugins &rarr; Manage &rarr; Available &rarr; Lazy Loading Sections

## License
GPL 2, for bundled thirdparty components see the respective subdirectories.
