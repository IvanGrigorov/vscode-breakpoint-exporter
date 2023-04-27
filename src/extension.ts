// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "breakpoint-exporter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let exportBreakpontsDisposable = vscode.commands.registerCommand('breakpoint-exporter.export', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		exportBreakponts();
	});

	let importBreakpontsDisposable = vscode.commands.registerCommand('breakpoint-exporter.import', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const breakpointsJson = await vscode.window.showInputBox();
		importBreakpoint(breakpointsJson || '');
	});

	context.subscriptions.push(exportBreakpontsDisposable);
}

async function exportBreakponts() {
	let breakpoints : any[] = [];
	vscode.debug.breakpoints.forEach(bp => {
		let brp = bp as any;
		let location = Object.assign(brp.location);
		breakpoints.push(location);
	});
	let json = JSON.stringify(breakpoints);
    const document = await vscode.workspace.openTextDocument({
        content: json
    });
    vscode.window.showTextDocument(document);

}

function importBreakpoint(json: string) {
	let jsonasobjectarray = JSON.parse(json) as any[];
	if (!jsonasobjectarray || !Array.isArray(jsonasobjectarray)) {
		window.showErrorMessage("Cannot parse Breakpoint info correctly");
		return;
	}
	jsonasobjectarray.forEach(jsonasobject => {
		jsonasobject.range[0].line++;
		vscode.debug.addBreakpoints([new vscode.SourceBreakpoint(
			new vscode.Location(
				vscode.Uri.file(jsonasobject.uri.path),
				new vscode.Position(jsonasobject.range[0].line, jsonasobject.range[0].charecter)
			), jsonasobject.enabled, jsonasobject.condition, jsonasobject.hitCondition, jsonasobject.logMessage)])
	
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
