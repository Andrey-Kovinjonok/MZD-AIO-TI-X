'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const opn = require('opn'); //A better node-open
const Config = require('electron-config'); //persistant data
require('./menus/application-menu.js'); //Menu
require('electron-debug')();// adds debug features like hotkeys for triggering dev tools and reload

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		'minWidth': 600,
		'minHeight': 400,
		'icon': './site/favicon.ico',
		//'autoHideMenuBar':true
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	resetDefaults();
});

function resetDefaults() {
	const config = new Config();

	config.set('unicorn', 'Uni');
	console.log(config.get('unicorn'));
	//=> 'Uni'

	// use dot-notation to access nested properties
	config.set('foo.bar', true);
	console.log(config.get('foo'));
	//=> {bar: true}
}
