
//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

	import * as vscode from 'vscode'
	import virtuous = require( '@kary/virtuous' )

//
// ─── FORMAT ─────────────────────────────────────────────────────────────────────
//

	export function formatWithVirtuous ( document: vscode.TextDocument ) {

		const start =
			new vscode.Position( 0, 0 );
		const end =
			new vscode.Position( document.lineCount - 1, document.lineAt( document.lineCount - 1 ).text.length )
		const docRange =
			new vscode.Range( start, end )
		const result =
			new Array<vscode.TextEdit>( )
		const content =
			document.getText( docRange )

		const formatted = virtuous.format( content )
		if ( formatted.success ) {
			result.push( new vscode.TextEdit( docRange, formatted.value ) )
			return result
		}

		vscode.window.showErrorMessage( 'Virtuous could not parse your code.' )
	}

//
// ─── REGISTRATION ───────────────────────────────────────────────────────────────
//

	// this method is called when your extension is activated
	// your extension is activated the very first time the command is executed
	export function activate ( context: vscode.ExtensionContext ) {
		registerFormatter( context )
	}

//
// ─── FUNCTION REGISTER FORMATTER ────────────────────────────────────────────────
//

	function registerFormatter ( context: vscode.ExtensionContext ) {
		context.subscriptions.push(
			vscode.languages.registerDocumentFormattingEditProvider( "json", {
				provideDocumentFormattingEdits: ( document, options, token ) =>
					formatWithVirtuous( document )
			})
		)

		context.subscriptions.push(
			vscode.languages.registerDocumentRangeFormattingEditProvider( "json", {
				provideDocumentRangeFormattingEdits: ( document, range, options, token ) =>
					formatWithVirtuous( document )
			})
		)
	}

// ────────────────────────────────────────────────────────────────────────────────
